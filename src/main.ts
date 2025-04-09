import "dotenv/config";
import "./register-events";
import express, { json } from "express";
import cors from "cors";
import socketController from "./controllers/socket.controller";
import { createServer } from "http";
import { Server } from "socket.io";
import socketService from "./services/socket.service";
import { Logger } from "@in.pulse-crm/utils";


const app = express();
const ROUTE_PREFIX = "/api/ws";

app.use(cors());
app.use(json());

app.use(ROUTE_PREFIX, socketController.routes);
const server = createServer(app);

const SERVER_PORT = +(process.env["LISTEN_PORT"] || 8004);
server.listen(SERVER_PORT);
Logger.info(`Socket service started on port ${SERVER_PORT}!`);

const socket = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5000",
			"http://localhost:6000",
			"http://localhost:6001",
			"https://inpulse.infotecrs.inf.br",
			"https://socket.infotecrs.inf.br",
			"http://localhost:3000",
		],
		methods: ["GET", "POST"]
	}
});

socketService.setServer(socket);

export default server;
