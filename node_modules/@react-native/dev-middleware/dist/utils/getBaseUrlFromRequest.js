"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = getBaseUrlFromRequest;
function getBaseUrlFromRequest(req) {
  const hostHeader = req.headers.host;
  if (hostHeader == null) {
    return null;
  }
  const scheme = req.socket.encrypted === true ? "https" : "http";
  const url = `${scheme}://${req.headers.host}`;
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
