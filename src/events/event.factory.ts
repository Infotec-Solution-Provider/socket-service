import { Logger } from "@in.pulse-crm/utils";
import Event from "./event";
import { SocketEventType } from "@in.pulse-crm/sdk";

type EventConstructor = new (room: string, data: any) => Event;

type ValidationSchema = {
	parse: (data: any) => any;
};

class EventFactory {
	private static eventRegistry: Map<string, EventConstructor> = new Map();
	private static eventSchemas: Map<string, ValidationSchema> = new Map();

	public static register(type: SocketEventType, constructor: EventConstructor, schema?: ValidationSchema): void {
		Logger.info(`Registering event type: ${type}`);
		EventFactory.eventRegistry.set(type, constructor);

		if (schema) {
			EventFactory.eventSchemas.set(type, schema);
		}
	}

	public static createEvent(type?: any, room?: any, data?: any): Event | Error {
		if (!room || typeof room !== "string" || !room.trim()) {
			return new Error("Room name is required.");
		}
		if (!type || typeof type !== "string" || !type.trim()) {
			return new Error("Event type is required");
		}

		const EventConstructor = EventFactory.eventRegistry.get(type);
		const EventSchema = EventFactory.eventSchemas.get(type);

		if (!EventConstructor) {
			return new Error("Invalid event type.");
		}

		if (EventSchema) {
			data = EventSchema.parse(data);
		}

		return new EventConstructor(room, data);
	}
}

export default EventFactory;
