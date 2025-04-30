import Event from "../events/event";
import { Server, Socket } from "socket.io";
import authService from "./auth.service";
import { Logger, sanitizeErrorMessage } from "@in.pulse-crm/utils";
import {
	SocketClientRoom,
	SocketServerRoom,
	SessionData,
	SocketServerWalletRoom
} from "@in.pulse-crm/sdk";
import whatsappService from "./whatsapp.service";
import internalService from "./internal.service";

class SocketService {
	private server: Server | null = null;

	public emit(event: Event) {
		Logger.info(`(event) {${event.type}} room /${event.room}/`);
		const room = `${event.room}`;

		return this.server?.to(room).emit(event.type, event.data);
	}

	public joinRoom(
		session: SessionData,
		room: SocketClientRoom,
		socket: Socket
	) {
		let serverRoom: SocketServerRoom;
		console.log(session, room);

		if (
			["user:", "chat:", "internal-chat:"].some((prefix) =>
				room.startsWith(prefix)
			)
		) {
			serverRoom = `${session.instance}:${room}` as SocketServerRoom;
		} else {
			serverRoom = `${session.instance}:${session.sectorId}:${room}`;
		}

		const ip = socket.conn.remoteAddress;
		const isAdminRoom = ["admin", "monitor", "reports"].some((prefix) =>
			room.startsWith(prefix)
		);

		if (session.role !== "ADMIN" && isAdminRoom) {
			const logMsg = `(event) {join_room}: ${ip} - ${session.role} is not allowed to enter /${serverRoom}/`;
			Logger.error(logMsg);
			return;
		}

		socket.join(serverRoom);
		Logger.info(`(event) {join_room}: ${ip} entered /${serverRoom}/`);
	}

	public leaveRoom(
		session: SessionData,
		room: SocketClientRoom,
		socket: Socket
	) {
		const serverRoom = `${session.instance}:${
			room.includes("chat:") ? room : `${session.sectorId}:${room}`
		}` as SocketServerRoom;
		const ip = socket.conn.remoteAddress;
		socket.leave(serverRoom);
		Logger.info(`(event) {leave_room}: ${ip} left /${serverRoom}/`);
	}

	private async joinAllUserChatRooms(socket: Socket, token: string) {
		try {
			const { chats } = await whatsappService.getChatsBySession(
				false,
				false,
				token
			);

			for (const chat of chats) {
				socket.join(`${chat.instance}:chat:${chat.id}`);
			}
		} catch (err) {
			console.error(err);
		}
	}
	private async joinAllUserInternalChatRooms(socket: Socket, token: string) {
		try {
			const { chats } = await internalService.getInternalChatsBySession(
				token
			);

			for (const chat of chats) {
				socket.join(`${chat.instance}:internal-chat:${chat.id}`);
			}
		} catch (err) {
			Logger.error(`Falha ao buscar chats internos`, err as Error);
		}
	}

	private async joinAllUserWalletRooms(
		socket: Socket,
		instance: string,
		userId: number
	) {
		try {
			const wallets = await whatsappService.getUserWallets(
				instance,
				userId
			);

			for (const wallet of wallets) {
				const walletRoom: SocketServerWalletRoom = `${instance}:wallet:${wallet.id}`;
				socket.join(walletRoom);
			}
		} catch (err) {
			Logger.error(
				`Falha ao buscar carteiras do usuário ${userId} na instância ${instance}`,
				err as Error
			);
		}
	}

	public setServer(server: Server) {
		this.server = server;

		this.server.on("connection", async (socket) => {
			const ip = socket.conn.remoteAddress;
			Logger.info(
				`(event) {connection}: ${ip} connected to the socket server.`
			);

			const token = socket.handshake.auth["token"];

			if (!token) {
				socket.disconnect();
				Logger.info(
					`(event) {disconnection}: ${ip} disconnected due to missing token.`
				);
				return;
			}

			try {
				const session = await authService.fetchSessionData(token);

				authService.initOnlineSession(token);
				this.joinAllUserChatRooms(socket, token);
				this.joinAllUserInternalChatRooms(socket, token);
				this.joinAllUserWalletRooms(
					socket,
					session.instance,
					session.userId
				);

				socket.on("disconnect", () => {
					authService.finishOnlineSession(token);
					Logger.info(
						`(event) {disconnection}: ${ip} disconnected from the socket server.`
					);
					this.leaveRoom(session, `user:${session.userId}`, socket);
				});

				this.joinRoom(session, `user:${session.userId}`, socket);

				if (session.role === "ADMIN") {
					this.joinRoom(session, "admin", socket);
				}

				socket.on("join-room", (room: SocketClientRoom) => {
					this.joinRoom(session, room, socket);
				});

				socket.on("leave-room", (room: SocketClientRoom) => {
					this.leaveRoom(session, room, socket);
				});
			} catch (error) {
				Logger.error(
					"(event) {connection}: " + sanitizeErrorMessage(error),
					error as Error
				);
				socket.disconnect();
			}
		});
	}
}

export default new SocketService();
