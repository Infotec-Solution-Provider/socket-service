
import { SocketEventType, InternalChatFinishedEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class InternalChatFinishedEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: InternalChatFinishedEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.InternalChatFinished;
	}

	get data() {
		return this.eventData;
	}
}

export default InternalChatFinishedEvent;
