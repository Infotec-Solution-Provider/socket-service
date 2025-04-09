import { SocketEventType } from "@in.pulse-crm/sdk";

abstract class Event {
	abstract get room(): string;
	abstract get type(): SocketEventType;
	abstract get data(): object;
}

export default Event;
