import { SocketEventType } from "@in.pulse-crm/sdk";
import Event from "./event";

class WWEBJSSessionStatusEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: object
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return "wwebjs_session_status" as SocketEventType;
	}

	get data() {
		return this.eventData;
	}
}

export default WWEBJSSessionStatusEvent;
