import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 4002;

const server = app.listen(PORT, () => {
  console.log(`Task Service running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down Task Service...");

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);