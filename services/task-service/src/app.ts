import express, { type Express } from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authenticate } from "./middleware/auth.middleware.js";
import taskRoutes from "./modules/tasks/task.routes.js";

const app: Express = express();

app.use(express.json());
app.use(errorMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Task Service is running",
  });
});

app.get("/api/v1/test-auth", authenticate, (req, res) => {
  res.status(200).json({
    message: "Authentication successful",
    user: req.user,
  });
});
app.use("/api/v1/tasks", taskRoutes);

export default app;