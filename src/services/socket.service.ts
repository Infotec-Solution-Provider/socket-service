import Event from "../events/event";
import { Server, Socket } from "socket.io";
import authService from "./auth.service";
import { Logger, sanitizeErrorMessage } from "@in.pulse-crm/utils";
import {
	SocketClientRoom,
	SocketServerRoom,
	SessionData,
	SocketClientUserRoom
} from "@in.pulse-crm/sdk";

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
		const serverRoom = `${session.instance}:${
			room.includes("chat:") ? room : `${session.sectorId}:${room}`
		}` as SocketServerRoom;
		const ip = socket.conn.remoteAddress;

		if (
			session.role !== "ADMIN" &&
			["admin", "monitor", "reports"].some((v) => room.includes(v))
		) {
			Logger.error(
				`(event) {join_room}: ${ip} - ${session.role} is not allowed to enter /${serverRoom}/`
			);
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
				const { data: session } = await authService.fetchSessionData(
					token
				);

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
