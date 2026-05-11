const request = require("supertest");
const { app, server } = require("../src/app");

afterAll(() => {
  server.close();
});

describe("REST API Tests", () => {
  test("GET /tickers returns list of tickers", async () => {
    const res = await request(app).get("/tickers");

    expect(res.statusCode).toBe(200);

    expect(res.body.tickers).toContain("AAPL");
  });

  test("GET /history/AAPL returns historical data", async () => {
    const res = await request(app).get("/history/AAPL");

    expect(res.statusCode).toBe(200);

    expect(res.body.symbol).toBe("AAPL");

    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("GET /history/UNKNOWN returns 404", async () => {
    const res = await request(app).get("/history/UNKNOWN");

    expect(res.statusCode).toBe(404);
  });
});
