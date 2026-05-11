const request = require("supertest");
const { app } = require("../src/app");

let token;

beforeAll(async () => {
  const res = await request(app).post("/login").send({
    username: "MultiBank",
    password: "MultiBank",
  });

  token = res.body.token;
});

describe("REST API Tests", () => {
  test("Login success returns token", async () => {
    const res = await request(app).post("/login").send({
      username: "MultiBank",
      password: "MultiBank",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("Login failure returns 401", async () => {
    const res = await request(app).post("/login").send({
      username: "admin",
      password: "wrong",
    });

    expect(res.statusCode).toBe(401);
  });

  test("GET /tickers returns list", async () => {
    const res = await request(app)
      .get("/tickers")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.tickers).toContain("AAPL");
  });

  test("GET /history/AAPL returns data", async () => {
    const res = await request(app)
      .get("/history/AAPL")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.symbol).toBe("AAPL");
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /history/UNKNOWN returns 404", async () => {
    const res = await request(app)
      .get("/history/UNKNOWN")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
