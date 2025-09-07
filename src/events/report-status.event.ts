import { ReportStatusEventData, SocketEventType } from "@in.pulse-crm/sdk";
import Event from "./event";

class ReportStatusEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: ReportStatusEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.ReportStatus;
	}

	get data() {
		return this.eventData;
	}
}

export default ReportStatusEvent;
