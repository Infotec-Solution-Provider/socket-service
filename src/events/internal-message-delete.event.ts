import { InternalMessageDeleteEventData, SocketEventType } from "@in.pulse-crm/sdk";
import Event from "./event";

class InternalMessageDeleteEvent implements Event {
    constructor(
        private readonly roomName: string,
        private readonly eventData: InternalMessageDeleteEventData
    ) { }

    get room() {
        return this.roomName;
    }

    get type() {
        return SocketEventType.InternalMessageDelete;
    }

    get data() {
        return this.eventData;
    }
}

export default InternalMessageDeleteEvent;
