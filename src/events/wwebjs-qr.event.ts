import { SocketEventType, WWEBJSQrEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WWEBJSQrEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WWEBJSQrEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WwebjsQr;
	}

	get data() {
		return this.eventData;
	}
}

export default WWEBJSQrEvent;
