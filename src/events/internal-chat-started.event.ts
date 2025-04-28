import { SocketEventType, InternalChatStartedEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class InternalChatStartedEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: InternalChatStartedEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.InternalChatStarted;
	}

	get data() {
		return this.eventData;
	}
}

export default InternalChatStartedEvent;
