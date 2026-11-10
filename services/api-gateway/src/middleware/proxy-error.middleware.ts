import type { Request, Response } from "express";
import type { Socket } from "node:net";

import { logger } from "../lib/logger.js";

export function handleProxyError(error: Error, req: Request, res: Response | Socket): void {
    logger.error(
        {
            error: error.message,
            requestId: req.headers["x-request-id"],
            path: req.originalUrl,
        },
        "Proxy request failed",
    );

    if ("status" in res) {
        if (res.headersSent) {
            return;
        }

        const isTimeout = error.message.toLowerCase().includes("timeout");

        res.status(isTimeout ? 504 : 503).json({
            success: false,
            message: isTimeout
                ? "Upstream service timed out"
                : "Upstream service unavailable",
            requestId: req.headers["x-request-id"],
        });

        return;
    }

    res.destroy();
}