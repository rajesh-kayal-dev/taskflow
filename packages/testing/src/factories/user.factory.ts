import { uniqueId } from "../helpers/unique-id.js";

export interface TestUserInput {
  name?: string;
  email?: string;
  password?: string;
}

/** Builds unique user input. Align fields with the real Auth validation schema. */
export function buildTestUser(overrides: TestUserInput = {}) {
  const id = uniqueId();

  return {
    name: "TaskFlow Test User",
    email: `taskflow-${id}@example.test`,
    password: "TestPassword!123",
    ...overrides,
  };
}
