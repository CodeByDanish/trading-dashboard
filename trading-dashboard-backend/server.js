const { server } = require("./src/app");
const { spawn } = require("child_process");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server start on https:localhost:${PORT}`);

  const wsClient = spawn("node", ["ws-test.js"], { stdio: "inherit" });
});
