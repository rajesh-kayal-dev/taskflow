import type { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    console.error(error);

    // Handle invalid JSON
    if (error instanceof SyntaxError && "body" in error) {
        res.status(400).json({
            message: "Invalid JSON payload",
        });

        return;
    }

    res.status(500).json({
        message: "Internal server error",
    });
};