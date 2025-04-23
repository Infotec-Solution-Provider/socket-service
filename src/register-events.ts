import { SocketEventType } from "@in.pulse-crm/sdk";
import EventFactory from "./events/event.factory";
import ReportStatusEvent from "./events/report-status.event";
import WppChatFinishedEvent from "./events/wpp-chat-finished.event";
import WppMessageEvent from "./events/wpp-message.event";
import WWEBJSAuthEvent from "./events/wwebjs-auth.event";
import WWEBJSQrEvent from "./events/wwebjs-qr.event";
import reportStatusSchema from "./schemas/report-status.schema";
import wppChatFinishedSchema from "./schemas/wpp-chat-finished.schema";
import wwebjsAuthSchema from "./schemas/wwebjs-auth.schema";
import wwebjsQrSchema from "./schemas/wwebjs-qr.schema";
import WppChatStartedEvent from "./events/wpp-chat-started.event";
import wppChatStartedSchema from "./schemas/wpp-chat-started.schema";
import WppContactMessagesReadEvent from "./events/wpp-contact-messages-read.event";
import WppMessageStatusEvent from "./events/wpp-message-status.event";

// Evento de conversa do whatsapp finalizada
EventFactory.register(
	SocketEventType.WppChatFinished,
	WppChatFinishedEvent,
	wppChatFinishedSchema
);

EventFactory.register(
	SocketEventType.WppChatStarted,
	WppChatStartedEvent,
	wppChatStartedSchema
);

// Evento de mensagem do whatsapp
EventFactory.register(SocketEventType.WppMessage, WppMessageEvent);


// Evento de status de mensagem do whatsapp
EventFactory.register(
	SocketEventType.WppMessageStatus,
	WppMessageStatusEvent
);

// Evento de status de mensagem do whatsapp
EventFactory.register(
	SocketEventType.WppContactMessagesRead,
	WppContactMessagesReadEvent
);

// Evento de QR Code do WWEBJS
EventFactory.register(SocketEventType.WwebjsQr, WWEBJSQrEvent, wwebjsQrSchema);

// Evento de autenticação do WWEBJS
EventFactory.register(
	SocketEventType.WwebjsAuth,
	WWEBJSAuthEvent,
	wwebjsAuthSchema
);

// Evento de status de relatório
EventFactory.register(
	SocketEventType.ReportStatus,
	ReportStatusEvent,
	reportStatusSchema
);
