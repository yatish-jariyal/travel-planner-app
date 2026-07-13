import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { writeLog } from "./logger.js";
import { createServices } from "./services.js";

const config = loadConfig();
const app = createApp(createServices(config), config);
const server = app.listen(config.port, () => {
  writeLog("info", "server_started", { port: config.port });
});

const shutdown = () => {
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
