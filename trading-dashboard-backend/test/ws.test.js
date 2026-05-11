const WebSocket = require("ws");
const request = require("supertest");
const { server, app } = require("../src/app");

jest.setTimeout(10000);

let port;
let token;

beforeAll((done) => {
  const listener = server.listen(0, async () => {
    port = listener.address().port;

    const res = await request(app).post("/login").send({
      username: "MultiBank",
      password: "MultiBank",
    });

    token = res.body.token;

    done();
  });
});

afterAll((done) => {
  server.close(done);
});

test("WebSocket connects and receives welcome message", (done) => {
  const ws = new WebSocket(`ws://localhost:${port}/ws?token=${token}`);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    expect(data.type).toBe("Trading Dashboard WebSocket");

    ws.close();
    done();
  });

  ws.on("error", (err) => done(err));
});
