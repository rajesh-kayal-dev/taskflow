import type { Request, Response } from "express";


import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "./auth.service.js";

import {
    registerSchema,
    loginSchema
} from "./auth.validation.js";

export const register = async (req: Request, res: Response) => {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const user = await registerUser(result.data);

        return res.status(201).json({
            message: "Registration successful",
            data: user,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Email is already registered") {
            return res.status(409).json({ message: error.message });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        const { user, accessToken, refreshToken } = await loginUser(result.data);

        res.cookie(process.env.COOKIE_NAME!, refreshToken, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: Number(process.env.COOKIE_MAX_AGE),
            path: "/api/v1/auth",
        });

        return res.status(200).json({
            message: "Login successful",
            user,
            accessToken,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "Invalid email or password") {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {

        const token = req.cookies?.[process.env.COOKIE_NAME!];

        if (!token) {
            return res.status(401).json({
                message: "Refresh token required",
            });
        }

        const accessToken = await refreshAccessToken(token);

        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.[process.env.COOKIE_NAME!];

        if (token) {
            await logoutUser(token);
        }

        res.clearCookie(process.env.COOKIE_NAME!, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            path: "/api/v1/auth",
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};