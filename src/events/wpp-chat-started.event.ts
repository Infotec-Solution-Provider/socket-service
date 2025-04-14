import { SocketEventType, WppChatStartedEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppChatStartedEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppChatStartedEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppChatStarted;
	}

	get data() {
		return this.eventData;
	}
}

export default WppChatStartedEvent;
