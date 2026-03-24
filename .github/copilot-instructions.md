# Copilot Instructions for `socket-service`

## Purpose
`socket-service` is the **Socket.IO server** for the In.pulse CRM platform. Browser clients connect to it for real-time updates; backend services emit events to it via a simple REST endpoint (`POST /api/ws/emit/:room/:type`). All real-time push notifications in the application — new WhatsApp messages, chat transfers, QR codes, internal messages, report status, etc. — flow through this service.

## Tech Stack
| Concern | Choice |
|---|---|
| Runtime | Node.js + TypeScript 5 |
| HTTP Framework | Express 4 |
| WebSocket | Socket.IO 4 (`socket.io`) |
| Validation | Zod 3 |
| HTTP Client (internal) | Axios (via `@in.pulse-crm/sdk` service clients) |
| Shared libs | `@in.pulse-crm/sdk`, `@in.pulse-crm/utils`, `@inpulse/shared` (local) |
| No database | This service has no Prisma, no ORM, no DB — it is stateless except for in-memory socket rooms |

**TypeScript config**: strict mode fully enabled (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, etc.), `module: NodeNext`, `target: es2022`, output to `dist/`.

**Port**: `8004` (configurable via `LISTEN_PORT` env var).

## Folder Structure (`src/`)
```
src/
├── main.ts                  # Bootstrap: Express app, Socket.IO server, mounts socketController
├── register-events.ts       # Side-effect module: calls EventFactory.register() for every event type
├── controllers/
│   └── socket.controller.ts # Single REST controller: POST /api/ws/emit/:room/:type
├── events/
│   ├── event.ts             # Abstract base class: room, type, data getters
│   ├── event.factory.ts     # Static registry: register() + createEvent() factory
│   └── <name>.event.ts      # One concrete Event class per event type (17 events)
├── middlewares/
│   └── only-local.middlewae.ts  # Blocks non-localhost requests (note: typo in filename)
├── schemas/
│   └── <name>.schema.ts     # Zod schemas for events that need payload validation (8 schemas)
└── services/
    ├── socket.service.ts    # Core: Socket.IO Server wrapper — emit(), joinRoom(), leaveRoom(), connection handler
    ├── auth.service.ts      # AuthClient singleton → validates tokens, manages online sessions
    ├── whatsapp.service.ts  # WhatsappClient singleton → fetches chats/wallets for room auto-join
    └── internal.service.ts  # InternalChatClient singleton → fetches internal chats for room auto-join
```

## Event System

### Registration (`register-events.ts`)
All event types are registered at startup as a side-effect import in `main.ts`:
```ts
import "./register-events";
```
Each event is registered via:
```ts
EventFactory.register(SocketEventType.WppMessage, WppMessageEvent);
// or with a Zod schema for payload validation:
EventFactory.register(SocketEventType.WppChatFinished, WppChatFinishedEvent, wppChatFinishedSchema);
```

### Event Factory (`event.factory.ts`)
- `EventFactory` holds two static `Map`s: one for event constructors, one for optional Zod schemas.
- `createEvent(type, room, data)` validates `type`/`room`, runs Zod `parse` if a schema is registered, then instantiates the event class.
- Returns `Event | Error` — callers check `instanceof Error`.

### Concrete Events (`events/<name>.event.ts`)
Each event implements the `Event` abstract class with three getters: `room`, `type`, `data`. They are thin value objects:
```ts
class WppMessageEvent implements Event {
  constructor(private readonly roomName: string, private readonly eventData: WppMessageEventData) {}
  get room() { return this.roomName; }
  get type() { return SocketEventType.WppMessage; }
  get data() { return this.eventData; }
}
```

### Dispatching (`socket.service.ts`)
`socketService.emit(event)` calls `this.server?.to(event.room).emit(event.type, event.data)` — a standard Socket.IO room broadcast.

### Registered Event Types (from `SocketEventType` in `@in.pulse-crm/sdk`)
| Category | Events |
|---|---|
| WhatsApp chat | `WppChatStarted`, `WppChatFinished`, `WppChatTransfer` |
| WhatsApp messages | `WppMessage`, `WppMessageEdit`, `WppMessageDelete`, `WppMessageStatus`, `WppContactMessagesRead` |
| WhatsApp auth | `WwebjsQr`, `WwebjsAuth` |
| Internal chat | `InternalChatStarted`, `InternalChatFinished` |
| Internal messages | `InternalMessage`, `InternalMessageEdit`, `InternalMessageDelete`, `InternalMessageStatus` |
| Reports | `ReportStatus` |

## How Other Services Emit Events (REST → Socket)
Backend services (e.g. `whatsapp-service`) emit events by calling:
```
POST /api/ws/emit/:room/:type
Body: { ...eventPayload }
```
`SocketController` calls `EventFactory.createEvent(type, room, body)` → `socketService.emit(event)`. No direct Socket.IO coupling in callers — they use `SocketServerClient` from `@in.pulse-crm/sdk` which wraps this REST call.

The `onlyLocal` middleware (available but **not globally applied** — see notes below) can restrict this endpoint to localhost callers only.

## Client Connection & Room System
Browser clients connect via Socket.IO with a `token` in `socket.handshake.auth.token`. On connection:
1. Token is validated via `authService.fetchSessionData(token)`.
2. Online session is started (`authService.initOnlineSession(token)`).
3. Socket auto-joins: all active WPP chat rooms, all internal chat rooms, all wallet rooms, and the user's personal room (`{instance}:user:{userId}`).
4. Admin users additionally join the `{instance}:admin` room.
5. Client can emit `join-room` / `leave-room` socket events to subscribe to additional rooms.

### Room Naming Convention
Server-side rooms are always namespaced by `instance`:
- `{instance}:user:{userId}` — personal user room
- `{instance}:chat:{chatId}` — WPP chat room
- `{instance}:internal-chat:{chatId}` — internal chat room
- `{instance}:{sectorId}:wallet:{walletId}` — wallet room
- `{instance}:admin` — admin broadcast
- `{instance}:monitor`, `{instance}:reports` — supervisor rooms (admin-only)

## Auth & Middleware
- **Client auth**: Socket.IO handshake `auth.token` is validated against `auth-service` via `AuthClient`. Invalid/missing token → immediate disconnect.
- **REST auth**: No token check on `POST /api/ws/emit` by default. The `onlyLocal` middleware exists to restrict to localhost, but is not globally mounted — apply it per-route if needed.
- **Admin-only rooms**: `SocketService.joinRoom` checks `session.role !== "ADMIN"` before joining `admin`, `monitor`, or `reports` rooms and silently refuses unauthorized joins.

## Build / Dev Commands
```bash
npm run dev      # ts-node-dev --transpile-only --respawn src/main.ts (hot reload)
npm run build    # tsc → dist/
npm start        # node dist/main.js
```

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `LISTEN_PORT` | `8004` | HTTP/WebSocket port |
| `AUTH_API_URL` | `http://localhost:8001` | users/auth service for token validation |
| `WHATSAPP_API_URL` | *(from SDK default)* | whatsapp-service for fetching chats/wallets on connect |

## Code Conventions
- **Singleton services**: every service file exports `export default new XxxService()`.
- **Controller pattern**: class with a `router` field exposed via a `get routes()` getter. Only one controller exists. Constructor registers all routes.
- **Event pattern**: one file per event type in `events/`. Filename: `<kebab-name>.event.ts`. Class name: `<PascalName>Event`. Implements abstract `Event`.
- **Schema pattern**: one Zod schema file per event that requires validation in `schemas/`. Filename: `<kebab-name>.schema.ts`. Only events with structured/validated payloads get a schema; raw pass-through events (e.g. `WppMessage`) do not.
- **Naming**: `camelCase` variables/methods, `PascalCase` classes, `kebab-case` filenames.
- **Strict TypeScript**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` enabled — avoid `any`; use `unknown` in catch blocks.
- **Module resolution**: `NodeNext` — use `.js` extensions in relative imports if required.
- **Logging**: `Logger.info` / `Logger.error` / `Logger.debug` from `@in.pulse-crm/utils` for all operational logs. Log format: `(event) {eventName}: message`.

## Adding a New Event
1. Add the event type to `SocketEventType` in `@in.pulse-crm/sdk` and rebuild the SDK.
2. Create `src/events/<name>.event.ts` implementing `Event`.
3. *(Optional)* Create `src/schemas/<name>.schema.ts` with a Zod schema if payload validation is needed.
4. Register in `src/register-events.ts` via `EventFactory.register(SocketEventType.NewEvent, NewEvent, optionalSchema)`.
5. No changes to `main.ts` or the controller are needed — the factory handles dispatch automatically.
