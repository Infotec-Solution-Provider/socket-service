import { SocketEventType, InternalMessageEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class InternalMessageEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: InternalMessageEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.InternalMessage;
	}

	get data() {
		return this.eventData;
	}
}

export default InternalMessageEvent;
