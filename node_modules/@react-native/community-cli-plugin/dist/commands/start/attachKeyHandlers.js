"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = attachKeyHandlers;
var _OpenDebuggerKeyboardHandler = _interopRequireDefault(
  require("./OpenDebuggerKeyboardHandler")
);
var _chalk = _interopRequireDefault(require("chalk"));
var _invariant = _interopRequireDefault(require("invariant"));
var _readline = _interopRequireDefault(require("readline"));
var _tty = require("tty");
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const CTRL_C = "\u0003";
const CTRL_D = "\u0004";
const RELOAD_TIMEOUT = 500;
const throttle = (callback, timeout) => {
  let previousCallTimestamp = 0;
  return () => {
    const currentCallTimestamp = new Date().getTime();
    if (currentCallTimestamp - previousCallTimestamp > timeout) {
      previousCallTimestamp = currentCallTimestamp;
      callback();
    }
  };
};
function attachKeyHandlers({ devServerUrl, messageSocket, reporter }) {
  if (process.stdin.isTTY !== true) {
    reporter.update({
      type: "unstable_server_log",
      level: "info",
      data: "Interactive mode is not supported in this environment",
    });
    return;
  }
  _readline.default.emitKeypressEvents(process.stdin);
  setRawMode(true);
  const reload = throttle(() => {
    reporter.update({
      type: "unstable_server_log",
      level: "info",
      data: "Reloading connected app(s)...",
    });
    messageSocket.broadcast("reload", null);
  }, RELOAD_TIMEOUT);
  const openDebuggerKeyboardHandler = new _OpenDebuggerKeyboardHandler.default({
    reporter,
    devServerUrl,
  });
  process.stdin.on("keypress", (str, key) => {
    if (openDebuggerKeyboardHandler.maybeHandleTargetSelection(key.name)) {
      return;
    }
    switch (key.sequence) {
      case "r":
        reload();
        break;
      case "d":
        reporter.update({
          type: "unstable_server_log",
          level: "info",
          data: "Opening Dev Menu...",
        });
        messageSocket.broadcast("devMenu", null);
        break;
      case "j":
        void openDebuggerKeyboardHandler.handleOpenDebugger();
        break;
      case CTRL_C:
      case CTRL_D:
        openDebuggerKeyboardHandler.dismiss();
        reporter.update({
          type: "unstable_server_log",
          level: "info",
          data: "Stopping server",
        });
        setRawMode(false);
        process.stdin.pause();
        process.emit("SIGINT");
        process.exit();
    }
  });
  reporter.update({
    type: "unstable_server_log",
    level: "info",
    data: `Key commands available:

  ${_chalk.default.bold.inverse(" r ")} - reload app(s)
  ${_chalk.default.bold.inverse(" d ")} - open Dev Menu
  ${_chalk.default.bold.inverse(" j ")} - open DevTools
`,
  });
}
function setRawMode(enable) {
  (0, _invariant.default)(
    process.stdin instanceof _tty.ReadStream,
    "process.stdin must be a readable stream to modify raw mode"
  );
  process.stdin.setRawMode(enable);
}
