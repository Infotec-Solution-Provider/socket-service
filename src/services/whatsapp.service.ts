import { WhatsappClient } from "@in.pulse-crm/sdk";

const BASE_URL = process.env["WHATSAPP_BASE_URL"] || "http://localhost:8005";

export default new WhatsappClient(BASE_URL);
