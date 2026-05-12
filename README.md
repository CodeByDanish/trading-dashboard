# Trading Dashboard

## Project Overview

A real-time trading dashboard built with React (Frontend) and Node.js (Backend) that simulates live market data and displays interactive price updates.

The system uses WebSocket for real-time communication between frontend and backend, enabling live ticker updates and responsive UI changes.

Docker is used to containerize both frontend and backend services for consistent development and deployment environments.

## Project Structure

trading-dashboard/
│
├── frontend/ # React + TypeScript UI
├── backend/ # Node.js + Express + WebSocket API
├── docker-compose.yml

## Tech Stack

### Frontend

- React (TypeScript)
- React Router
- CSS Variables (Theming system)
- WebSocket client
- REST API integration

### Backend

- Node.js
- Express.js
- WebSocket (ws / socket.io)
- JWT Authentication

---

## Tech Stack

- React (TypeScript)
- React Router
- CSS Variables (Theming system)
- REST API integration
- WebSocket (real-time updates)

---

## Assumptions & Trade-offs

- Authentication is token-based using a simple JWT system
- No refresh token mechanism is implemented
- Data is mocked from backend service
- WebSocket is used for real-time updates

---

## System Flow

Backend (Trade Data Simulator)
↓
WebSocket Server
↓
Frontend React Client
↓
Live UI Updates
