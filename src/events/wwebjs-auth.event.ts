import { SocketEventType, WWEBJSAuthEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WWEBJSAuthEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WWEBJSAuthEventData
	) { }

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WwebjsAuth;
	}

	get data() {
		return this.eventData;
	}
}

export default WWEBJSAuthEvent;
