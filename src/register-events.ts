import { SocketEventType } from "@in.pulse-crm/sdk";
import EventFactory from "./events/event.factory";
import ReportStatusEvent from "./events/report-status.event";
import WppChatFinishedEvent from "./events/wpp-chat-finished.event";
import WppChatTransferEvent from "./events/wpp-chat-transfer.event";
import WppMessageEvent from "./events/wpp-message.event";
import WWEBJSAuthEvent from "./events/wwebjs-auth.event";
import WWEBJSQrEvent from "./events/wwebjs-qr.event";
import reportStatusSchema from "./schemas/report-status.schema";
import wppChatFinishedSchema from "./schemas/wpp-chat-finished.schema";
import wppChatTransferSchema from "./schemas/wpp-chat-transfer.schema";
import wwebjsAuthSchema from "./schemas/wwebjs-auth.schema";
import wwebjsQrSchema from "./schemas/wwebjs-qr.schema";
import WppChatStartedEvent from "./events/wpp-chat-started.event";
import wppChatStartedSchema from "./schemas/wpp-chat-started.schema";
import WppContactMessagesReadEvent from "./events/wpp-contact-messages-read.event";
import WppMessageStatusEvent from "./events/wpp-message-status.event";
import InternalChatFinishedEvent from "./events/internal-chat-finished.event";
import InternalChatStartedEvent from "./events/internal-chat-started.event";
import InternalMessageEvent from "./events/internal-message.event";
import InternalMessageStatusEvent from "./events/internal-message-status.event";
import WppMessageEditEvent from "./events/wpp-message-edit.event";
import WppMessageDeleteEvent from "./events/wpp-message-delete.event";
import InternalMessageEditEvent from "./events/internal-message-edit.event";
import InternalMessageDeleteEvent from "./events/internal-message-delete.event";

// Evento de conversa do whatsapp finalizada
EventFactory.register(SocketEventType.WppChatFinished, WppChatFinishedEvent, wppChatFinishedSchema);

EventFactory.register(SocketEventType.WppChatStarted, WppChatStartedEvent, wppChatStartedSchema);
// Evento de conversa do whatsapp tranferida
EventFactory.register(SocketEventType.WppChatTransfer, WppChatTransferEvent, wppChatTransferSchema);

// Evento de mensagem do whatsapp
EventFactory.register(SocketEventType.WppMessage, WppMessageEvent);

// Evento de edição de mensagem do whatsapp
EventFactory.register(SocketEventType.WppMessageEdit, WppMessageEditEvent);

// Evento de mensagem apagada do whatsapp
EventFactory.register(SocketEventType.WppMessageDelete, WppMessageDeleteEvent);

// Evento de status de mensagem do whatsapp
EventFactory.register(SocketEventType.WppMessageStatus, WppMessageStatusEvent);

// Evento de status de mensagem do whatsapp
EventFactory.register(SocketEventType.WppContactMessagesRead, WppContactMessagesReadEvent);

// Evento de QR Code do WWEBJS
EventFactory.register(SocketEventType.WwebjsQr, WWEBJSQrEvent, wwebjsQrSchema);

// Evento de autenticação do WWEBJS
EventFactory.register(SocketEventType.WwebjsAuth, WWEBJSAuthEvent, wwebjsAuthSchema);

// Evento de status de relatório
EventFactory.register(SocketEventType.ReportStatus, ReportStatusEvent, reportStatusSchema);
// Evento de conversa do interna finalizada
EventFactory.register(SocketEventType.InternalChatFinished, InternalChatFinishedEvent);

// Evento de conversa do interna iniciada
EventFactory.register(SocketEventType.InternalChatStarted, InternalChatStartedEvent);

// Evento de mensagem do interna
EventFactory.register(SocketEventType.InternalMessage, InternalMessageEvent);

// Evento de edição de mensagem do interna
EventFactory.register(SocketEventType.InternalMessageEdit, InternalMessageEditEvent);

// Evento de mensagem apagada do interna
EventFactory.register(SocketEventType.InternalMessageDelete, InternalMessageDeleteEvent);

// Evento de status de mensagem do interna
EventFactory.register(SocketEventType.InternalMessageStatus, InternalMessageStatusEvent);
