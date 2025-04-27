import { InternalChatClient } from "@in.pulse-crm/sdk";

const BASE_URL = process.env["WHATSAPP_BASE_URL"] || "http://localhost:8005";

export default new InternalChatClient(BASE_URL);
