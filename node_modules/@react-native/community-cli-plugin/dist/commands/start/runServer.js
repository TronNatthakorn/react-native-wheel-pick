"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _createDevMiddlewareLogger = _interopRequireDefault(
  require("../../utils/createDevMiddlewareLogger")
);
var _isDevServerRunning = _interopRequireDefault(
  require("../../utils/isDevServerRunning")
);
var _loadMetroConfig = _interopRequireDefault(
  require("../../utils/loadMetroConfig")
);
var version = _interopRequireWildcard(require("../../utils/version"));
var _attachKeyHandlers = _interopRequireDefault(require("./attachKeyHandlers"));
var _middleware = require("./middleware");
var _devMiddleware = require("@react-native/dev-middleware");
var _chalk = _interopRequireDefault(require("chalk"));
var _metro = _interopRequireDefault(require("metro"));
var _metroCore = require("metro-core");
var _path = _interopRequireDefault(require("path"));
var _url = _interopRequireDefault(require("url"));
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function (e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || ("object" != typeof e && "function" != typeof e))
    return { default: e };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = { __proto__: null },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e)
    if ("default" !== u && {}.hasOwnProperty.call(e, u)) {
      var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
      i && (i.get || i.set) ? Object.defineProperty(n, u, i) : (n[u] = e[u]);
    }
  return (n.default = e), t && t.set(e, n), n;
}
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
async function runServer(_argv, cliConfig, args) {
  const metroConfig = await (0, _loadMetroConfig.default)(cliConfig, {
    config: args.config,
    maxWorkers: args.maxWorkers,
    port: args.port,
    resetCache: args.resetCache,
    watchFolders: args.watchFolders,
    projectRoot: args.projectRoot,
    sourceExts: args.sourceExts,
  });
  const hostname = args.host?.length ? args.host : "localhost";
  const {
    projectRoot,
    server: { port },
    watchFolders,
  } = metroConfig;
  const protocol = args.https === true ? "https" : "http";
  const devServerUrl = _url.default.format({
    protocol,
    hostname,
    port,
  });
  console.info(
    _chalk.default.blue(
      `\nWelcome to React Native v${cliConfig.reactNativeVersion}`
    )
  );
  const serverStatus = await (0, _isDevServerRunning.default)(
    devServerUrl,
    projectRoot
  );
  if (serverStatus === "matched_server_running") {
    console.info(
      `A dev server is already running for this project on port ${port}. Exiting.`
    );
    return;
  } else if (serverStatus === "port_taken") {
    console.error(
      `${_chalk.default.red(
        "error"
      )}: Another process is running on port ${port}. Please terminate this ` +
        'process and try again, or use another port with "--port".'
    );
    return;
  }
  console.info(`Starting dev server on ${devServerUrl}\n`);
  if (args.assetPlugins) {
    metroConfig.transformer.assetPlugins = args.assetPlugins.map((plugin) =>
      require.resolve(plugin)
    );
  }
  if (!args.clientLogs) {
    metroConfig.server.forwardClientLogs = false;
  }
  let reportEvent;
  const terminal = new _metroCore.Terminal(process.stdout);
  const ReporterImpl = getReporterImpl(args.customLogReporterPath);
  const terminalReporter = new ReporterImpl(terminal);
  const {
    middleware: communityMiddleware,
    websocketEndpoints: communityWebsocketEndpoints,
    messageSocketEndpoint,
    eventsSocketEndpoint,
  } = (0, _middleware.createDevServerMiddleware)({
    host: hostname,
    port,
    watchFolders,
  });
  const { middleware, websocketEndpoints } = (0,
  _devMiddleware.createDevMiddleware)({
    projectRoot,
    serverBaseUrl: devServerUrl,
    logger: (0, _createDevMiddlewareLogger.default)(terminalReporter),
  });
  metroConfig.reporter = {
    update(event) {
      terminalReporter.update(event);
      if (reportEvent) {
        reportEvent(event);
      }
      if (args.interactive && event.type === "initialize_done") {
        terminalReporter.update({
          type: "unstable_server_log",
          level: "info",
          data: `Dev server ready. ${_chalk.default.dim(
            "Press Ctrl+C to exit."
          )}`,
        });
        (0, _attachKeyHandlers.default)({
          devServerUrl,
          messageSocket: messageSocketEndpoint,
          reporter: terminalReporter,
        });
      }
    },
  };
  const serverInstance = await _metro.default.runServer(metroConfig, {
    host: args.host,
    secure: args.https,
    secureCert: args.cert,
    secureKey: args.key,
    unstable_extraMiddleware: [communityMiddleware, middleware],
    websocketEndpoints: {
      ...communityWebsocketEndpoints,
      ...websocketEndpoints,
    },
  });
  reportEvent = eventsSocketEndpoint.reportEvent;
  serverInstance.keepAliveTimeout = 30000;
  await version.logIfUpdateAvailable(cliConfig, terminalReporter);
}
function getReporterImpl(customLogReporterPath) {
  if (customLogReporterPath == null) {
    return require("metro/src/lib/TerminalReporter");
  }
  try {
    return require(customLogReporterPath);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") {
      throw e;
    }
    return require(_path.default.resolve(customLogReporterPath));
  }
}
var _default = (exports.default = runServer);
