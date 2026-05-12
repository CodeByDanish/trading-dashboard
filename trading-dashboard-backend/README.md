## Trading Dashboard Backend

## Project Overview

A backend service built with Node.js, Express, and WebSocket for a real-time trading dashboard. It provides REST APIs and live trade data simulation to support real-time price updates in the frontend.

---

## Tech Stack

- Node.js
- Express.js
- WebSocket (ws)
- JWT Authentication
- CORS
- Jest (Testing)
- Nodemon

---

## Project Structure

backend/
│
├── src/
│ └── app.js
│
├── server.js
├── ws-test.js
│
├── tests/
│ ├── app.test.js
│ ├── login.test.js
│ └── ws.test.js
│
├── package.json

---

## Installation

### Clone the repository

```bash
git clone https://github.com/CodeByDanish/trading-dashboard.git

cd trading-dashboard-backend

npm install

npm run dev
```

### Running Tests

```bash
npm test
```

## Test Credentials

Use the following demo credentials for authentication testing:

```bash
Username: MultiBank
Password: MultiBank

```

## Environment Variables

PORT=3000

---

## Features

- REST API for trading data
- WebSocket real-time price updates
- JWT authentication system
- Mock trade data generation
- CORS enabled for frontend integration
- Modular backend architecture

---

## WebSocket Flow

Trade Data Generator
↓
WebSocket Server
↓
Frontend Live Updates

---

## Authentication Flow

- User logs in via API
- Server generates JWT token
- Token is used for protected routes

---

## Testing

- Jest for unit testing

---

## Notes

- No database used (in-memory mock data)
- Designed for real-time trading simulation
- WebSocket handles live streaming updates
