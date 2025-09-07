import { SocketEventType, WppChatTransferEventData } from "@in.pulse-crm/sdk";
import Event from "./event";

class WppChatTransferEvent implements Event {
	constructor(
		private readonly roomName: string,
		private readonly eventData: WppChatTransferEventData
	) {}

	get room() {
		return this.roomName;
	}

	get type() {
		return SocketEventType.WppChatTransfer;
	}

	get data() {
		return this.eventData;
	}
}

export default WppChatTransferEvent;
