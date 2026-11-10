process.env.NODE_ENV = "test";

process.env.FRONTEND_URL = "http://localhost:3000";

process.env.DATABASE_URL =
  "postgresql://test:test@localhost:5432/taskflow_test";

process.env.JWT_ACCESS_SECRET =
  "test-access-secret-at-least-32-characters-long";

process.env.JWT_REFRESH_SECRET =
  "test-refresh-secret-at-least-32-characters-long";

process.env.COOKIE_NAME = "taskflow_refresh";

process.env.COOKIE_SECURE = "false";

process.env.COOKIE_MAX_AGE = "604800000";