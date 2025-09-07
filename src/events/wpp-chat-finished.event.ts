import { SocketEventType, WppChatFinishedEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppChatFinishedEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppChatFinishedEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppChatFinished;
	}

	get data() {
		return this.eventData;
	}
}

export default WppChatFinishedEvent;
