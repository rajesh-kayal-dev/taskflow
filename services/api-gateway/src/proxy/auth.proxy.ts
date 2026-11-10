import { createProxyMiddleware } from "http-proxy-middleware";
import type { RequestHandler } from "express";

import { env } from "../config/env.js";
import { handleProxyError } from "../middleware/proxy-error.middleware.js";

export const authProxy: RequestHandler = createProxyMiddleware({
  target: env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathFilter: "/api/v1/auth",

  proxyTimeout: env.REQUEST_TIMEOUT_MS,

  on: {
    proxyReq: (proxyReq, req) => {
      const requestId = req.headers["x-request-id"];

      if (requestId) {
        proxyReq.setHeader("x-request-id", requestId);
      }
    },

    error: handleProxyError,
  },
});