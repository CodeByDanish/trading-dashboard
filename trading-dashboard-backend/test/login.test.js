const request = require("supertest");
const { app } = require("../src/app");

describe("Login API", () => {
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
});
