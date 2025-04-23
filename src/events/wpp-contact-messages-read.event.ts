import { SocketEventType, WppContactMessagesReadEventData } from "@in.pulse-crm/sdk";

class WppContactMessagesReadEvent {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppContactMessagesReadEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppContactMessagesRead;
	}

	get data() {
		return this.eventData;
	}
}

export default WppContactMessagesReadEvent;
