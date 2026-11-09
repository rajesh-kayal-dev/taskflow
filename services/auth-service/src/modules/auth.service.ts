import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import type { RegisterInput, LoginInput } from "../types/auth.types.js";
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshToken } from "../lib/jwt.js";


export const registerUser = async ({ email, password }: RegisterInput) => {

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email: normalizedEmail,
            passwordHash,
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
        },
    });

    return user;
};


export const loginUser = async ({ email, password }: LoginInput) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const payload = {
        userId: user.id,
        email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await storeRefreshToken(refreshToken, user.id);

    return {
        user: {
            id: user.id,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};

const storeRefreshToken = async (token: string, userId: string) => {
    await prisma.refreshToken.create({
        data: {
            tokenHash: hashRefreshToken(token),
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
};

export const refreshAccessToken = async (token: string) => {
    const payload = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
        where: {
            tokenHash: hashRefreshToken(token),
        },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
    });

    return newAccessToken;
}

export const logoutUser = async (token: string) => {
    await prisma.refreshToken.deleteMany({
        where: {
            tokenHash: hashRefreshToken(token),
        },
    });
};