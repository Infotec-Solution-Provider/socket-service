import Event from "./event";
import { SocketEventType } from "@in.pulse-crm/sdk";

interface TelephonyCallReceivedEventData {
	uniqueid: string;
	callerNumber: string;
	callerName: string | null;
	ramal: string;
	operatorId: number | null;
	instance: string;
	receivedAt: string;
	receptiveCallId: number | null;
}

class TelephonyCallReceivedEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: TelephonyCallReceivedEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return "telephony_call_received" as SocketEventType;
	}

	get data() {
		return this.eventData;
	}
}

export default TelephonyCallReceivedEvent;
