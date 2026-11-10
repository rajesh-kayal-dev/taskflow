import type { ErrorRequestHandler } from "express";

import { logger } from "../lib/logger.js";

export const errorMiddleware: ErrorRequestHandler = (error, req, res, _next) => {
    logger.error(
        {
            error: error.message,
            requestId: req.headers["x-request-id"],
            path: req.originalUrl,
        },
        "Unexpected API Gateway error",
    );

    if (res.headersSent) {
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
        requestId: req.headers["x-request-id"],
    });
};