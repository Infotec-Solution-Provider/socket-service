import { SocketEventType, InternalMessageStatusEventData } from "@in.pulse-crm/sdk";

class InternalMessageStatusEvent {
	constructor(
		private readonly roomName: string,
		private readonly eventData: InternalMessageStatusEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.InternalMessageStatus;
	}

	get data() {
		return this.eventData;
	}
}

export default InternalMessageStatusEvent;
