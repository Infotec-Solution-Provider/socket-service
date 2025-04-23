import { SocketEventType, WppMessageStatusEventData } from "@in.pulse-crm/sdk";

class WppMessageStatusEvent {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppMessageStatusEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppMessageStatus;
	}

	get data() {
		return this.eventData;
	}
}

export default WppMessageStatusEvent;
