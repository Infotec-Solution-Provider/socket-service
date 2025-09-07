import { SocketEventType, WppMessageEditEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppMessageEditEvent implements Event {
	constructor(private readonly roomName: string, private readonly eventData: WppMessageEditEventData) {}

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

export default WppMessageEditEvent;
