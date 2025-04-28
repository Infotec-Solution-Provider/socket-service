import { Request, Response, Router } from "express";
import EventFactory from "../events/event.factory";
import socket from "../services/socket.service";
import { sanitizeErrorMessage } from "@in.pulse-crm/utils";
import { ZodError } from "zod";

class SocketController {
	constructor(private readonly router: Router) {
		this.router.post("/emit/:room/:type", this.emitEvent);
	}

	public get routes() {
		return this.router;
	}

	private async emitEvent(req: Request, res: Response) {
		try {
			const { room, type } = req.params;

			console.log("Emitting event", room, type, req.body);

			const event = EventFactory.createEvent(type, room, req.body);

			if (event instanceof Error) {
				res.status(400).json({
					message: sanitizeErrorMessage(event),
					cause: event
				});
				return;
			}

			socket.emit(event);

			res.status(200).json({
				message: "Event emitted successfully"
			});
		} catch (error) {
			console.error(error);

			if (error instanceof ZodError) {
				res.status(400).json({
					message: "Validation error",
					cause: error.issues
				});
				return;
			}

			res.status(500).json({
				message: "Failed to emit event",
				cause: error
			});
		}
	}
}

export default new SocketController(Router());
