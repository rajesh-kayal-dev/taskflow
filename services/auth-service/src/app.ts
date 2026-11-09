import express, { type Express } from "express";
import authRoutes from "./modules/auth.routes.js";
import cookieParser from "cookie-parser";

const app: Express = express();



app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "auth-service",
    status: "healthy",
  });
});
app.use("/api/v1/auth", authRoutes);


export default app;