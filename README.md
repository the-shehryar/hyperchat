# HyperChat

> Real-time chat application built with native WebSockets, Node.js, MongoDB and vanilla JavaScript.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20WebSockets%20%7C%20MongoDB-orange)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%7C%20Sass%20%7C%20JS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

HyperChat is a full-stack real-time chat application built on the native WebSocket API — no Socket.io, no abstractions. Users register, authenticate, and exchange messages instantly with persistent history stored in MongoDB.

Built as a deep dive into how real-time communication actually works at the protocol level — understanding the WebSocket handshake, connection lifecycle, and event broadcasting by hand before ever reaching for a library.

---

## Features

- Real-time messaging with zero page refresh
- User authentication — register, login, logout
- Online presence indicators — see who is active
- Message history — persisted to MongoDB
- Typing indicators — live feedback while composing
- Responsive UI built with Sass

---

## Tech Stack

### Frontend

```
HTML5           — Semantic markup
Sass/SCSS       — Modular styles compiled to CSS
Vanilla JS      — DOM manipulation
WebSocket API   — Native browser WebSocket client
```

### Backend

```
Node.js         — JavaScript runtime
Express.js      — HTTP server and REST API
ws              — Native WebSocket server (no Socket.io)
MongoDB         — Document database
Mongoose        — Schema modeling and queries
JWT             — Stateless authentication
bcrypt          — Password hashing
```

---

## Architecture

```
Browser (HTML + Sass + Vanilla JS)
        ↓  HTTP  — login, register, load history
        ↓  WebSocket  — send, receive, presence
Node.js + ws Server
        ↓
MongoDB (users, messages)
```

### WebSocket Event Flow

```
Client opens WebSocket connection
      ↓
Server authenticates JWT on handshake
      ↓
Client sends message → server saves to MongoDB
                     → broadcasts to all connected clients
      ↓
Client disconnects → server broadcasts offline status
                   → cleans up connection
```

---

## Data Models

### User

```javascript
{
  username: String,    // unique display name
  email: String,       // unique, used for login
  password: String,    // bcrypt hashed
  createdAt: Date,
  lastSeen: Date
}
```

### Message

```javascript
{
  content: String,
  sender: ObjectId,    // ref to User
  createdAt: Date
}
```

---

## Key Technical Decisions

**Why native WebSocket over Socket.io**
Using the browser's native `WebSocket` API and the `ws` Node.js package meant understanding the protocol directly — framing, opcodes, ping/pong, connection teardown — without a library managing it. Every reconnection and broadcast was written explicitly.

**Why JWT on the WebSocket handshake**
Validating the token at the HTTP upgrade request level means unauthenticated clients never establish a persistent connection. More secure than checking on every message event.

**Why vanilla JS over a framework**
The goal was understanding the DOM and WebSocket API without abstraction. Every event listener and DOM update was wired by hand — a deliberate choice for learning depth over development speed.

---

## What I Learned

- WebSocket handshake — how HTTP upgrades to a persistent connection
- Managing multiple concurrent connections on a single server
- Broadcasting to all clients vs targeted messaging
- Handling disconnects and stale connections gracefully
- JWT validation at the WebSocket connection level
- Mongoose schema design for append-only message data
- Structuring a Node.js project — routes, controllers, models, socket handlers separated cleanly

---

## Roadmap

Chat rooms are the natural next iteration — one global channel works for a demo but a room-based architecture would require:

- Room model with membership tracking
- Per-room broadcast instead of global broadcast
- Room creation and join flow on the frontend

Not planned for active development but i'll fix and update it — the project served its learning purpose.

---

## Running Locally

```bash
# Clone
git clone https://github.com/isherriz/hyperchat

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your MongoDB URI and JWT secret

# Start the server
npm run dev
```

```bash
# .env
MONGO_URI=mongodb://localhost:27017/hyperchat
JWT_SECRET=your_secret_key
PORT=3000
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

**Shehryar Mazhar**
React Native Developer · Former Logistics Operations Supervisor

[LinkedIn](https://linkedin.com/in/isherriz) · [GitHub](https://github.com/the-shehryar)
