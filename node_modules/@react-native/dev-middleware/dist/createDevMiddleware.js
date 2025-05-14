"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = createDevMiddleware;
var _InspectorProxy = _interopRequireDefault(
  require("./inspector-proxy/InspectorProxy")
);
var _openDebuggerMiddleware = _interopRequireDefault(
  require("./middleware/openDebuggerMiddleware")
);
var _DefaultBrowserLauncher = _interopRequireDefault(
  require("./utils/DefaultBrowserLauncher")
);
var _debuggerFrontend = _interopRequireDefault(
  require("@react-native/debugger-frontend")
);
var _connect = _interopRequireDefault(require("connect"));
var _path = _interopRequireDefault(require("path"));
var _serveStatic = _interopRequireDefault(require("serve-static"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
function createDevMiddleware({
  projectRoot,
  serverBaseUrl,
  logger,
  unstable_browserLauncher = _DefaultBrowserLauncher.default,
  unstable_eventReporter,
  unstable_experiments: experimentConfig = {},
  unstable_customInspectorMessageHandler,
}) {
  const experiments = getExperiments(experimentConfig);
  const eventReporter = createWrappedEventReporter(
    unstable_eventReporter,
    logger
  );
  const inspectorProxy = new _InspectorProxy.default(
    projectRoot,
    serverBaseUrl,
    eventReporter,
    experiments,
    unstable_customInspectorMessageHandler
  );
  const middleware = (0, _connect.default)()
    .use(
      "/open-debugger",
      (0, _openDebuggerMiddleware.default)({
        serverBaseUrl,
        inspectorProxy,
        browserLauncher: unstable_browserLauncher,
        eventReporter,
        experiments,
        logger,
      })
    )
    .use(
      "/debugger-frontend/embedder-static/embedderScript.js",
      (_req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.end("");
      }
    )
    .use(
      "/debugger-frontend",
      (0, _serveStatic.default)(_path.default.join(_debuggerFrontend.default), {
        fallthrough: false,
      })
    )
    .use((...args) => inspectorProxy.processRequest(...args));
  return {
    middleware,
    websocketEndpoints: inspectorProxy.createWebSocketListeners(),
  };
}
function getExperiments(config) {
  return {
    enableOpenDebuggerRedirect: config.enableOpenDebuggerRedirect ?? false,
    enableNetworkInspector: config.enableNetworkInspector ?? false,
  };
}
function createWrappedEventReporter(reporter, logger) {
  return {
    logEvent(event) {
      switch (event.type) {
        case "profiling_target_registered":
          logger?.info(
            `Profiling build target "${event.appId}" registered for debugging`
          );
          break;
        case "fusebox_console_notice":
          logger?.info(
            "\n" +
              "\u001B[7m" +
              " \u001B[1m💡 JavaScript logs have moved!\u001B[22m They can now be " +
              "viewed in React Native DevTools. Tip: Type \u001B[1mj\u001B[22m in " +
              "the terminal to open (requires Google Chrome or Microsoft Edge)." +
              "\u001B[27m" +
              "\n"
          );
          break;
      }
      reporter?.logEvent(event);
    },
  };
}
