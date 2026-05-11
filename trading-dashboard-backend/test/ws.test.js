jest.setTimeout(100000);

const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const { server } = require("../src/app");

let ws;
let port;

beforeAll((done) => {
  // Let OS choose free port
  const listener = server.listen(0, () => {
    port = listener.address().port;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

test("WebSocket connects and receives welcome message", (done) => {
  ws = new WebSocket(`ws://localhost:${port}/ws`);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    expect(data.type).toBe("connected");

    ws.close();

    done();
  });

  ws.on("error", (err) => {
    done(err);
  });
});
