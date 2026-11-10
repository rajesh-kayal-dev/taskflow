/**
 * TEMPLATE: identify pure business rules in the current Task Service first.
 *
 * Suggested cases:
 * - valid task input passes validation;
 * - invalid title/status is rejected according to the real schema;
 * - a user can access their own task;
 * - a user cannot access another user's task;
 * - status transitions are tested only if the service enforces a state machine.
 *
 * Do not test rules the application does not implement.
 */
