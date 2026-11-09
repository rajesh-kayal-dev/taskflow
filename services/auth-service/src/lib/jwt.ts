import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.types.js";
import crypto from "node:crypto";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, refreshSecret) as JwtPayload;
};

export const hashRefreshToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};