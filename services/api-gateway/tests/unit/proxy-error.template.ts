/**
 * TEMPLATE: turn into proxy-error.test.ts after verifying the installed
 * http-proxy-middleware version's timeout and connection-reset events.
 *
 * Cases to cover:
 * - unreachable upstream returns 503;
 * - upstream timeout returns 504;
 * - an already-sent response is not written to again;
 * - socket errors safely destroy the socket.
 *
 * Do not rely only on error.message containing "timeout"; verify actual
 * error codes/events emitted by the installed middleware version.
 */
