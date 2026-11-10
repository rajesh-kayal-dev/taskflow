import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const authenticate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    res.status(401).json({
      message: "Invalid authorization header",
    });
    return;
  }

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    next(new Error("JWT_ACCESS_SECRET is not configured"));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        message: "Invalid access token",
      });
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};