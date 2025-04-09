import { SocketEventType, WppMessageEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppMessageEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppMessageEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppMessage;
	}

	get data() {
		return this.eventData;
	}
}

export default WppMessageEvent;
