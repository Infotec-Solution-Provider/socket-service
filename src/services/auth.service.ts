import "dotenv/config";
import { AuthClient } from "@in.pulse-crm/sdk";

export default new AuthClient(
	process.env["AUTH_API_URL"] || "http://localhost:8001"
);
