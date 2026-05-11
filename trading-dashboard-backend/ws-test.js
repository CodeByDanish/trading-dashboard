const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const SECRET_KEY =
  "DASDASDASDNKASDASDB123123KNASJ12312NKCN000$$@@@#@#@#@##$#$#$";

const token = jwt.sign({ username: "admin" }, SECRET_KEY, { expiresIn: "1h" });

const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

ws.on("open", () => {
  console.log("WS connected");

  ws.send(
    JSON.stringify({
      type: "subscribe",
      tickers: ["AAPL", "TSLA", "BTC-USD"],
    }),
  );
});

ws.on("message", (msg) => {
  const data = JSON.parse(msg.toString());

  console.log("WS message:", data);
});

ws.on("close", () => {
  console.log("WS closed");
});

ws.on("error", (err) => {
  console.error("WS error:", err);
});
