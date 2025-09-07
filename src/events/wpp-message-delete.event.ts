import { SocketEventType } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppMessageDeleteEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppMessageDeleteEvent
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppMessageEdit;
	}

	get data() {
		return this.eventData;
	}
}

export default WppMessageDeleteEvent;
