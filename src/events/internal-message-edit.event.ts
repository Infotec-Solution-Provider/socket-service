import { InternalMessageEditEventData, SocketEventType } from "@in.pulse-crm/sdk";
import Event from "./event";

class InternalMessageEditEvent implements Event {
    constructor(
        private readonly roomName: string,
        private readonly eventData: InternalMessageEditEventData
    ) { }

    get room() {
        return this.roomName;
    }

    get type() {
        return SocketEventType.InternalMessageEdit;
    }

    get data() {
        return this.eventData;
    }
}

export default InternalMessageEditEvent;
