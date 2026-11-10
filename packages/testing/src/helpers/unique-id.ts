import { randomUUID } from "node:crypto";


export function uniqueId(): string {
  return randomUUID();
}