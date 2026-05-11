const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const webSocket = require("ws");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

const AvailableTickers = ["AAPL", "TSLA", "BTC-USD"];

const AvailableHistoricalData = {
  AAPL: [{ time: Date.now() - 60000, close: 150 }],
  TSLA: [{ time: Date.now() - 60000, close: 200 }],
  "BTC-USD": [{ time: Date.now() - 60000, close: 30000 }],
};

const SECRET_KEY =
  "DASDASDASDNKASDASDB123123KNASJ12312NKCN000$$@@@#@#@#@##$#$#$";

const USER_TEST = {
  username: "MultiBank",
  password: "MultiBank",
};

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER_TEST.username && password === USER_TEST.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({
      success: true,
      token,
    });
  }

  res
    .status(401)
    .json({ success: false, message: "Invalid user. Please try again" });
});

app.get("/tickers", authMiddleware, (req, res) => {
  res.json({ tikcers: AvailableTickers });
});

app.get("/history/:symbol", authMiddleware, (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  if (!AvailableHistoricalData[symbol]) {
    return res
      .status(401)
      .json({ error: "Unknow symbol, Please use correct symbol" });
  }
  res.json({ symbol, data: AvailableHistoricalData[symbol] });
});

const server = http.createServer(app);

const wss = new webSocket.Server({ server, path: "/ws" });

function verifyTokenFromQuery(url) {
  const [, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  const token = params.get("token");

  if (!token) return null;
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return null;
  }
}

wss.on("connection", (ws, req) => {
  const user = verifyTokenFromQuery(req.url);

  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
    ws.close(4001, "Invalid or expire token, Please try again");
    return;
  }

  ws.user = user;
  ws.subscriptions = new Set(AvailableTickers);

  ws.send(
    JSON.stringify({
      type: "Trading Dashboard WebSocket",
      message: "You are connected to mock data",
      availableTickers: AvailableTickers,
    }),
  );

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.type === "subscribe") {
      ws.subscriptions = new Set(data.tickers);
    }
  });
});
function randomPrice(last) {
  const change = (Math.random() - 0.5) * 2;
  return Math.max(1, last + change);
}

const lastAvailablePriceList = {
  AAPL: 70,
  TSLA: 110,
  "BTC-USD": 2800,
};

setInterval(() => {
  const now = Date.now();

  for (const symbol of AvailableTickers) {
    lastAvailablePriceList[symbol] = randomPrice(
      lastAvailablePriceList[symbol],
    );
  }
  const updates = AvailableTickers.map((symbol) => ({
    symbol,
    time: now,
    price: Number(lastAvailablePriceList[symbol].toFixed(2)),
  }));

  wss.clients.forEach((client) => {
    if (client.readyState !== webSocket.OPEN) return;
    const subs = client.subscriptions || new Set(AvailableTickers);
    const filtered = updates.filter((u) => subs.has(u.symbol));
    if (filtered.length > 0) {
      client.send(
        JSON.stringify({
          type: "price_update",
          data: filtered,
        }),
      );
    }
  });
}, 1000);

module.exports = { app, server, wss };
