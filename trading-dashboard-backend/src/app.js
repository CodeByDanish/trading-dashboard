const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();

const SECRET_KEY =
  "DASDASDASDNKASDASDB123123KNASJ12312NKCN000$$@@@#@#@#@##$#$#$";

const CORS_ORIGIN = "http://localhost:5173";

const AvailableTickers = ["AAPL", "TSLA", "BTC-USD"];

const AvailableHistoricalData = {
  AAPL: [{ time: Date.now() - 60000, close: 150 }],
  TSLA: [{ time: Date.now() - 60000, close: 200 }],
  "BTC-USD": [{ time: Date.now() - 60000, close: 30000 }],
};

const USER_TEST = {
  username: "MultiBank",
  password: "MultiBank",
};

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

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
  } catch {
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

  return res.status(401).json({
    success: false,
    message: "Invalid user. Please try again",
  });
});

app.get("/tickers", authMiddleware, (req, res) => {
  res.json({ tickers: AvailableTickers });
});

app.get("/history/:symbol", authMiddleware, (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  if (!AvailableHistoricalData[symbol]) {
    return res.status(404).json({ error: "Unknown symbol" });
  }

  res.json({
    symbol,
    data: AvailableHistoricalData[symbol],
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

function verifyTokenFromQuery(url) {
  const [, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  const token = params.get("token");

  if (!token) return null;

  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

wss.on("connection", (ws, req) => {
  const user = verifyTokenFromQuery(req.url);

  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
    ws.close(4001, "Invalid token");
    return;
  }

  ws.user = user;
  ws.subscriptions = new Set(AvailableTickers);

  ws.send(
    JSON.stringify({
      type: "Trading Dashboard WebSocket",
      message: "Connected",
      availableTickers: AvailableTickers,
    }),
  );

  ws.on("message", (msg) => {
    let data;
    try {
      data = JSON.parse(msg.toString());
    } catch {
      return;
    }

    if (data.type === "subscribe") {
      ws.subscriptions = new Set(data.tickers || []);
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

const priceInterval = setInterval(() => {
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
    if (client.readyState !== WebSocket.OPEN) return;

    const subs = client.subscriptions || new Set(AvailableTickers);

    const filtered = updates.filter((u) => subs.has(u.symbol));

    if (filtered.length > 0) {
      client.send(JSON.stringify({ type: "price_update", data: filtered }));
    }
  });
}, 1000);

function shutdown() {
  clearInterval(priceInterval);

  return new Promise((resolve) => {
    wss.close(() => {
      server.close(() => {
        resolve();
      });
    });
  });
}

module.exports = {
  app,
  server,
  wss,
  shutdown,
};
