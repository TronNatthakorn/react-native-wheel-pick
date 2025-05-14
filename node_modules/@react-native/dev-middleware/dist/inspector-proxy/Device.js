"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;
var _DeviceEventReporter = _interopRequireDefault(
  require("./DeviceEventReporter")
);
var fs = _interopRequireWildcard(require("fs"));
var _invariant = _interopRequireDefault(require("invariant"));
var path = _interopRequireWildcard(require("path"));
var _ws = _interopRequireDefault(require("ws"));
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
const debug = require("debug")("Metro:InspectorProxy");
const PAGES_POLLING_INTERVAL = 1000;
const FILE_PREFIX = "file://";
let fuseboxConsoleNoticeLogged = false;
const REACT_NATIVE_RELOADABLE_PAGE_ID = "-1";
class Device {
  #id;
  #name;
  #app;
  #messageFromDeviceQueue = Promise.resolve();
  #deviceSocket;
  #pages = new Map();
  #debuggerConnection = null;
  #lastConnectedLegacyReactNativePage = null;
  #isLegacyPageReloading = false;
  #lastGetPagesMessage = "";
  #scriptIdToSourcePathMapping = new Map();
  #projectRoot;
  #deviceEventReporter;
  #pagesPollingIntervalId;
  #createCustomMessageHandler;
  #connectedPageIds = new Set();
  #deviceRelativeBaseUrl;
  #serverRelativeBaseUrl;
  constructor(deviceOptions) {
    this.#dangerouslyConstruct(deviceOptions);
  }
  #dangerouslyConstruct({
    id,
    name,
    app,
    socket,
    projectRoot,
    eventReporter,
    createMessageMiddleware,
    serverRelativeBaseUrl,
    deviceRelativeBaseUrl,
    isProfilingBuild,
  }) {
    this.#id = id;
    this.#name = name;
    this.#app = app;
    this.#deviceSocket = socket;
    this.#projectRoot = projectRoot;
    this.#serverRelativeBaseUrl = serverRelativeBaseUrl;
    this.#deviceRelativeBaseUrl = deviceRelativeBaseUrl;
    this.#deviceEventReporter = eventReporter
      ? new _DeviceEventReporter.default(eventReporter, {
          deviceId: id,
          deviceName: name,
          appId: app,
        })
      : null;
    this.#createCustomMessageHandler = createMessageMiddleware;
    if (isProfilingBuild) {
      this.#deviceEventReporter?.logProfilingTargetRegistered();
    }
    this.#deviceSocket.on("message", (message) => {
      this.#messageFromDeviceQueue = this.#messageFromDeviceQueue
        .then(async () => {
          const parsedMessage = JSON.parse(message);
          if (parsedMessage.event === "getPages") {
            if (message !== this.#lastGetPagesMessage) {
              debug(
                "(Debugger)    (Proxy) <- (Device), getPages ping has changed: " +
                  message
              );
              this.#lastGetPagesMessage = message;
            }
          } else {
            debug("(Debugger)    (Proxy) <- (Device): " + message);
          }
          await this.#handleMessageFromDevice(parsedMessage);
        })
        .catch((error) => {
          debug("%O\nHandling device message: %s", error, message);
          try {
            this.#deviceEventReporter?.logProxyMessageHandlingError(
              "device",
              error,
              message
            );
          } catch (loggingError) {
            debug(
              "Error logging message handling error to reporter: %O",
              loggingError
            );
          }
        });
    });
    this.#pagesPollingIntervalId = setInterval(
      () =>
        this.#sendMessageToDevice({
          event: "getPages",
        }),
      PAGES_POLLING_INTERVAL
    );
    this.#deviceSocket.on("close", () => {
      if (socket === this.#deviceSocket) {
        this.#deviceEventReporter?.logDisconnection("device");
        this.#terminateDebuggerConnection();
        clearInterval(this.#pagesPollingIntervalId);
      }
    });
  }
  #terminateDebuggerConnection() {
    const debuggerConnection = this.#debuggerConnection;
    if (debuggerConnection) {
      this.#sendDisconnectEventToDevice(
        this.#mapToDevicePageId(debuggerConnection.pageId)
      );
      debuggerConnection.socket.close();
      this.#debuggerConnection = null;
    }
  }
  dangerouslyRecreateDevice(deviceOptions) {
    (0, _invariant.default)(
      deviceOptions.id === this.#id,
      "dangerouslyRecreateDevice() can only be used for the same device ID"
    );
    const oldDebugger = this.#debuggerConnection;
    if (this.#app !== deviceOptions.app || this.#name !== deviceOptions.name) {
      this.#deviceSocket.close();
      this.#terminateDebuggerConnection();
    }
    this.#debuggerConnection = null;
    if (oldDebugger) {
      oldDebugger.socket.removeAllListeners();
      this.#deviceSocket.close();
      this.handleDebuggerConnection(oldDebugger.socket, oldDebugger.pageId, {
        debuggerRelativeBaseUrl: oldDebugger.debuggerRelativeBaseUrl,
        userAgent: oldDebugger.userAgent,
      });
    }
    this.#dangerouslyConstruct(deviceOptions);
  }
  getName() {
    return this.#name;
  }
  getApp() {
    return this.#app;
  }
  getPagesList() {
    if (this.#lastConnectedLegacyReactNativePage) {
      return [...this.#pages.values(), this.#createSyntheticPage()];
    } else {
      return [...this.#pages.values()];
    }
  }
  handleDebuggerConnection(
    socket,
    pageId,
    { debuggerRelativeBaseUrl, userAgent }
  ) {
    const page =
      pageId === REACT_NATIVE_RELOADABLE_PAGE_ID
        ? this.#createSyntheticPage()
        : this.#pages.get(pageId);
    if (!page) {
      debug(
        `Got new debugger connection via ${debuggerRelativeBaseUrl.href} for ` +
          `page ${pageId} of ${this.#name}, but no such page exists`
      );
      socket.close();
      return;
    }
    this.#deviceEventReporter?.logDisconnection("debugger");
    this.#terminateDebuggerConnection();
    this.#deviceEventReporter?.logConnection("debugger", {
      pageId,
      frontendUserAgent: userAgent,
    });
    const debuggerInfo = {
      socket,
      prependedFilePrefix: false,
      pageId,
      userAgent: userAgent,
      customHandler: null,
      debuggerRelativeBaseUrl,
    };
    this.#debuggerConnection = debuggerInfo;
    debug(
      `Got new debugger connection via ${debuggerRelativeBaseUrl.href} for ` +
        `page ${pageId} of ${this.#name}`
    );
    if (this.#debuggerConnection && this.#createCustomMessageHandler) {
      this.#debuggerConnection.customHandler = this.#createCustomMessageHandler(
        {
          page,
          debugger: {
            userAgent: debuggerInfo.userAgent,
            sendMessage: (message) => {
              try {
                const payload = JSON.stringify(message);
                debug("(Debugger) <- (Proxy)    (Device): " + payload);
                socket.send(payload);
              } catch {}
            },
          },
          device: {
            appId: this.#app,
            id: this.#id,
            name: this.#name,
            sendMessage: (message) => {
              try {
                const payload = JSON.stringify({
                  event: "wrappedEvent",
                  payload: {
                    pageId: this.#mapToDevicePageId(pageId),
                    wrappedEvent: JSON.stringify(message),
                  },
                });
                debug("(Debugger) -> (Proxy)    (Device): " + payload);
                this.#deviceSocket.send(payload);
              } catch {}
            },
          },
        }
      );
      if (this.#debuggerConnection.customHandler) {
        debug("Created new custom message handler for debugger connection");
      } else {
        debug(
          "Skipping new custom message handler for debugger connection, factory function returned null"
        );
      }
    }
    this.#sendConnectEventToDevice(this.#mapToDevicePageId(pageId));
    socket.on("message", (message) => {
      debug("(Debugger) -> (Proxy)    (Device): " + message);
      const debuggerRequest = JSON.parse(message);
      this.#deviceEventReporter?.logRequest(debuggerRequest, "debugger", {
        pageId: this.#debuggerConnection?.pageId ?? null,
        frontendUserAgent: userAgent,
        prefersFuseboxFrontend: this.#isPageFuseboxFrontend(
          this.#debuggerConnection?.pageId
        ),
      });
      let processedReq = debuggerRequest;
      if (
        this.#debuggerConnection?.customHandler?.handleDebuggerMessage(
          debuggerRequest
        ) === true
      ) {
        return;
      }
      if (!this.#pageHasCapability(page, "nativeSourceCodeFetching")) {
        processedReq = this.#interceptClientMessageForSourceFetching(
          debuggerRequest,
          debuggerInfo,
          socket
        );
      }
      if (processedReq) {
        this.#sendMessageToDevice({
          event: "wrappedEvent",
          payload: {
            pageId: this.#mapToDevicePageId(pageId),
            wrappedEvent: JSON.stringify(processedReq),
          },
        });
      }
    });
    socket.on("close", () => {
      debug(`Debugger for page ${pageId} and ${this.#name} disconnected.`);
      this.#deviceEventReporter?.logDisconnection("debugger");
      if (this.#debuggerConnection?.socket === socket) {
        this.#terminateDebuggerConnection();
      }
    });
    const sendFunc = socket.send;
    socket.send = function (message) {
      debug("(Debugger) <- (Proxy)    (Device): " + message);
      return sendFunc.call(socket, message);
    };
  }
  #sendConnectEventToDevice(devicePageId) {
    if (this.#connectedPageIds.has(devicePageId)) {
      return;
    }
    this.#connectedPageIds.add(devicePageId);
    this.#sendMessageToDevice({
      event: "connect",
      payload: {
        pageId: devicePageId,
      },
    });
  }
  #sendDisconnectEventToDevice(devicePageId) {
    if (!this.#connectedPageIds.has(devicePageId)) {
      return;
    }
    this.#connectedPageIds.delete(devicePageId);
    this.#sendMessageToDevice({
      event: "disconnect",
      payload: {
        pageId: devicePageId,
      },
    });
  }
  #pageHasCapability(page, flag) {
    return page.capabilities[flag] === true;
  }
  #createSyntheticPage() {
    return {
      id: REACT_NATIVE_RELOADABLE_PAGE_ID,
      title: "React Native Experimental (Improved Chrome Reloads)",
      vm: "don't use",
      app: this.#app,
      capabilities: {},
    };
  }
  async #handleMessageFromDevice(message) {
    if (message.event === "getPages") {
      this.#pages = new Map(
        message.payload.map(({ capabilities, ...page }) => [
          page.id,
          {
            ...page,
            capabilities: capabilities ?? {},
          },
        ])
      );
      if (message.payload.length !== this.#pages.size) {
        const duplicateIds = new Set();
        const idsSeen = new Set();
        for (const page of message.payload) {
          if (!idsSeen.has(page.id)) {
            idsSeen.add(page.id);
          } else {
            duplicateIds.add(page.id);
          }
        }
        debug(
          `Received duplicate page IDs from device: ${[...duplicateIds].join(
            ", "
          )}`
        );
      }
      for (const page of this.#pages.values()) {
        if (this.#pageHasCapability(page, "nativePageReloads")) {
          this.#logFuseboxConsoleNotice();
          continue;
        }
        if (page.title.includes("React")) {
          if (page.id !== this.#lastConnectedLegacyReactNativePage?.id) {
            this.#newLegacyReactNativePage(page);
            break;
          }
        }
      }
    } else if (message.event === "disconnect") {
      const pageId = message.payload.pageId;
      const page = this.#pages.get(pageId);
      if (page != null && this.#pageHasCapability(page, "nativePageReloads")) {
        return;
      }
      const debuggerSocket = this.#debuggerConnection
        ? this.#debuggerConnection.socket
        : null;
      if (debuggerSocket && debuggerSocket.readyState === _ws.default.OPEN) {
        if (
          this.#debuggerConnection != null &&
          this.#debuggerConnection.pageId !== REACT_NATIVE_RELOADABLE_PAGE_ID
        ) {
          debug(`Legacy page ${pageId} is reloading.`);
          debuggerSocket.send(
            JSON.stringify({
              method: "reload",
            })
          );
        }
      }
    } else if (message.event === "wrappedEvent") {
      if (this.#debuggerConnection == null) {
        return;
      }
      const debuggerSocket = this.#debuggerConnection.socket;
      if (
        debuggerSocket == null ||
        debuggerSocket.readyState !== _ws.default.OPEN
      ) {
        return;
      }
      const parsedPayload = JSON.parse(message.payload.wrappedEvent);
      const pageId = this.#debuggerConnection?.pageId ?? null;
      if ("id" in parsedPayload) {
        this.#deviceEventReporter?.logResponse(parsedPayload, "device", {
          pageId,
          frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
          prefersFuseboxFrontend: this.#isPageFuseboxFrontend(pageId),
        });
      }
      const debuggerConnection = this.#debuggerConnection;
      if (debuggerConnection != null) {
        if (
          debuggerConnection.customHandler?.handleDeviceMessage(
            parsedPayload
          ) === true
        ) {
          return;
        }
        await this.#processMessageFromDeviceLegacy(
          parsedPayload,
          debuggerConnection,
          pageId
        );
        const messageToSend = JSON.stringify(parsedPayload);
        debuggerSocket.send(messageToSend);
      } else {
        debuggerSocket.send(message.payload.wrappedEvent);
      }
    }
  }
  #sendMessageToDevice(message) {
    try {
      if (message.event !== "getPages") {
        debug("(Debugger)    (Proxy) -> (Device): " + JSON.stringify(message));
      }
      this.#deviceSocket.send(JSON.stringify(message));
    } catch (error) {}
  }
  #newLegacyReactNativePage(page) {
    debug(`React Native page updated to ${page.id}`);
    if (
      this.#debuggerConnection == null ||
      this.#debuggerConnection.pageId !== REACT_NATIVE_RELOADABLE_PAGE_ID
    ) {
      this.#lastConnectedLegacyReactNativePage = page;
      return;
    }
    const oldPageId = this.#lastConnectedLegacyReactNativePage?.id;
    this.#lastConnectedLegacyReactNativePage = page;
    this.#isLegacyPageReloading = true;
    if (oldPageId != null) {
      this.#sendDisconnectEventToDevice(oldPageId);
    }
    this.#sendConnectEventToDevice(page.id);
    const toSend = [
      {
        method: "Runtime.enable",
        id: 1e9,
      },
      {
        method: "Debugger.enable",
        id: 1e9,
      },
    ];
    for (const message of toSend) {
      const pageId = this.#debuggerConnection?.pageId ?? null;
      this.#deviceEventReporter?.logRequest(message, "proxy", {
        pageId,
        frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
        prefersFuseboxFrontend: this.#isPageFuseboxFrontend(pageId),
      });
      this.#sendMessageToDevice({
        event: "wrappedEvent",
        payload: {
          pageId: this.#mapToDevicePageId(page.id),
          wrappedEvent: JSON.stringify(message),
        },
      });
    }
  }
  #debuggerRelativeToDeviceRelativeUrl(
    debuggerRelativeUrl,
    { debuggerRelativeBaseUrl }
  ) {
    const deviceRelativeUrl = new URL(debuggerRelativeUrl.href);
    if (debuggerRelativeUrl.origin === debuggerRelativeBaseUrl.origin) {
      deviceRelativeUrl.hostname = this.#deviceRelativeBaseUrl.hostname;
      deviceRelativeUrl.port = this.#deviceRelativeBaseUrl.port;
      deviceRelativeUrl.protocol = this.#deviceRelativeBaseUrl.protocol;
    }
    return deviceRelativeUrl;
  }
  #deviceRelativeUrlToDebuggerRelativeUrl(
    deviceRelativeUrl,
    { debuggerRelativeBaseUrl }
  ) {
    const debuggerRelativeUrl = new URL(deviceRelativeUrl.href);
    if (deviceRelativeUrl.origin === this.#deviceRelativeBaseUrl.origin) {
      debuggerRelativeUrl.hostname = debuggerRelativeBaseUrl.hostname;
      debuggerRelativeUrl.port = debuggerRelativeBaseUrl.port;
      debuggerRelativeUrl.protocol = debuggerRelativeUrl.protocol;
    }
    return debuggerRelativeUrl;
  }
  #deviceRelativeUrlToServerRelativeUrl(deviceRelativeUrl) {
    const debuggerRelativeUrl = new URL(deviceRelativeUrl.href);
    if (deviceRelativeUrl.origin === this.#deviceRelativeBaseUrl.origin) {
      debuggerRelativeUrl.hostname = this.#serverRelativeBaseUrl.hostname;
      debuggerRelativeUrl.port = this.#serverRelativeBaseUrl.port;
      debuggerRelativeUrl.protocol = this.#serverRelativeBaseUrl.protocol;
    }
    return debuggerRelativeUrl;
  }
  async #processMessageFromDeviceLegacy(payload, debuggerInfo, pageId) {
    const page = pageId != null ? this.#pages.get(pageId) : null;
    if (
      (!page || !this.#pageHasCapability(page, "nativeSourceCodeFetching")) &&
      payload.method === "Debugger.scriptParsed" &&
      payload.params != null
    ) {
      const params = payload.params;
      if ("sourceMapURL" in params) {
        const sourceMapURL = this.#tryParseHTTPURL(params.sourceMapURL);
        if (sourceMapURL) {
          payload.params.sourceMapURL =
            this.#deviceRelativeUrlToDebuggerRelativeUrl(
              sourceMapURL,
              debuggerInfo
            ).href;
          try {
            const sourceMap = await this.#fetchText(
              this.#deviceRelativeUrlToServerRelativeUrl(sourceMapURL)
            );
            payload.params.sourceMapURL =
              "data:application/json;charset=utf-8;base64," +
              Buffer.from(sourceMap).toString("base64");
          } catch (exception) {
            this.#sendErrorToDebugger(
              `Failed to fetch source map ${params.sourceMapURL}: ${exception.message}`
            );
          }
        }
      }
      if ("url" in params) {
        let serverRelativeUrl = params.url;
        const parsedUrl = this.#tryParseHTTPURL(params.url);
        if (parsedUrl) {
          payload.params.url = this.#deviceRelativeUrlToDebuggerRelativeUrl(
            parsedUrl,
            debuggerInfo
          ).href;
          serverRelativeUrl =
            this.#deviceRelativeUrlToServerRelativeUrl(parsedUrl).href;
        }
        if (payload.params.url.match(/^[0-9a-z]+$/)) {
          payload.params.url = FILE_PREFIX + payload.params.url;
          debuggerInfo.prependedFilePrefix = true;
        }
        if ("scriptId" in params && params.scriptId != null) {
          this.#scriptIdToSourcePathMapping.set(
            params.scriptId,
            serverRelativeUrl
          );
        }
      }
    }
    if (
      payload.method === "Runtime.executionContextCreated" &&
      this.#isLegacyPageReloading
    ) {
      debuggerInfo.socket.send(
        JSON.stringify({
          method: "Runtime.executionContextsCleared",
        })
      );
      const resumeMessage = {
        method: "Debugger.resume",
        id: 0,
      };
      this.#deviceEventReporter?.logRequest(resumeMessage, "proxy", {
        pageId: this.#debuggerConnection?.pageId ?? null,
        frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
        prefersFuseboxFrontend: this.#isPageFuseboxFrontend(
          this.#debuggerConnection?.pageId
        ),
      });
      this.#sendMessageToDevice({
        event: "wrappedEvent",
        payload: {
          pageId: this.#mapToDevicePageId(debuggerInfo.pageId),
          wrappedEvent: JSON.stringify(resumeMessage),
        },
      });
      this.#isLegacyPageReloading = false;
    }
  }
  #interceptClientMessageForSourceFetching(req, debuggerInfo, socket) {
    switch (req.method) {
      case "Debugger.setBreakpointByUrl":
        return this.#processDebuggerSetBreakpointByUrl(req, debuggerInfo);
      case "Debugger.getScriptSource":
        this.#processDebuggerGetScriptSource(req, socket);
        return null;
      case "Network.loadNetworkResource":
        const response = {
          id: req.id,
          result: {
            error: {
              code: -32601,
              message:
                "[inspector-proxy]: Page lacks nativeSourceCodeFetching capability.",
            },
          },
        };
        socket.send(JSON.stringify(response));
        const pageId = this.#debuggerConnection?.pageId ?? null;
        this.#deviceEventReporter?.logResponse(response, "proxy", {
          pageId,
          frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
          prefersFuseboxFrontend: this.#isPageFuseboxFrontend(pageId),
        });
        return null;
      default:
        return req;
    }
  }
  #processDebuggerSetBreakpointByUrl(req, debuggerInfo) {
    const { debuggerRelativeBaseUrl, prependedFilePrefix } = debuggerInfo;
    const processedReq = {
      ...req,
      params: {
        ...req.params,
      },
    };
    if (processedReq.params.url != null) {
      const originalUrlParam = processedReq.params.url;
      const httpUrl = this.#tryParseHTTPURL(originalUrlParam);
      if (httpUrl) {
        processedReq.params.url = this.#debuggerRelativeToDeviceRelativeUrl(
          httpUrl,
          debuggerInfo
        ).href;
      } else if (
        originalUrlParam.startsWith(FILE_PREFIX) &&
        prependedFilePrefix
      ) {
        processedReq.params.url = originalUrlParam.slice(FILE_PREFIX.length);
      }
    }
    if (
      new Set(["10.0.2.2", "10.0.3.2"]).has(
        this.#deviceRelativeBaseUrl.hostname
      ) &&
      debuggerRelativeBaseUrl.hostname === "localhost" &&
      processedReq.params.urlRegex != null
    ) {
      processedReq.params.urlRegex = processedReq.params.urlRegex.replaceAll(
        "localhost",
        this.#deviceRelativeBaseUrl.hostname.replaceAll(".", "\\.")
      );
    }
    return processedReq;
  }
  #processDebuggerGetScriptSource(req, socket) {
    const sendSuccessResponse = (scriptSource) => {
      const response = {
        id: req.id,
        result: {
          scriptSource,
        },
      };
      socket.send(JSON.stringify(response));
      const pageId = this.#debuggerConnection?.pageId ?? null;
      this.#deviceEventReporter?.logResponse(response, "proxy", {
        pageId,
        frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
        prefersFuseboxFrontend: this.#isPageFuseboxFrontend(pageId),
      });
    };
    const sendErrorResponse = (error) => {
      const response = {
        id: req.id,
        result: {
          error: {
            message: error,
          },
        },
      };
      socket.send(JSON.stringify(response));
      this.#sendErrorToDebugger(error);
      const pageId = this.#debuggerConnection?.pageId ?? null;
      this.#deviceEventReporter?.logResponse(response, "proxy", {
        pageId,
        frontendUserAgent: this.#debuggerConnection?.userAgent ?? null,
        prefersFuseboxFrontend: this.#isPageFuseboxFrontend(pageId),
      });
    };
    const pathToSource = this.#scriptIdToSourcePathMapping.get(
      req.params.scriptId
    );
    if (pathToSource != null) {
      const httpURL = this.#tryParseHTTPURL(pathToSource);
      if (httpURL) {
        this.#fetchText(httpURL).then(
          (text) => sendSuccessResponse(text),
          (err) =>
            sendErrorResponse(
              `Failed to fetch source url ${pathToSource}: ${err.message}`
            )
        );
      } else {
        let file;
        try {
          file = fs.readFileSync(
            path.resolve(this.#projectRoot, pathToSource),
            "utf8"
          );
        } catch (err) {
          sendErrorResponse(
            `Failed to fetch source file ${pathToSource}: ${err.message}`
          );
        }
        if (file != null) {
          sendSuccessResponse(file);
        }
      }
    }
  }
  #mapToDevicePageId(pageId) {
    if (
      pageId === REACT_NATIVE_RELOADABLE_PAGE_ID &&
      this.#lastConnectedLegacyReactNativePage != null
    ) {
      return this.#lastConnectedLegacyReactNativePage.id;
    } else {
      return pageId;
    }
  }
  #tryParseHTTPURL(url) {
    let parsedURL;
    try {
      parsedURL = new URL(url);
    } catch {}
    const protocol = parsedURL?.protocol;
    if (protocol !== "http:" && protocol !== "https:") {
      parsedURL = undefined;
    }
    return parsedURL;
  }
  async #fetchText(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP " + response.status + " " + response.statusText);
    }
    const text = await response.text();
    if (text.length > 350000000) {
      throw new Error("file too large to fetch via HTTP");
    }
    return text;
  }
  #sendErrorToDebugger(message) {
    const debuggerSocket = this.#debuggerConnection?.socket;
    if (debuggerSocket && debuggerSocket.readyState === _ws.default.OPEN) {
      debuggerSocket.send(
        JSON.stringify({
          method: "Runtime.consoleAPICalled",
          params: {
            args: [
              {
                type: "string",
                value: message,
              },
            ],
            executionContextId: 0,
            type: "error",
          },
        })
      );
    }
  }
  #isPageFuseboxFrontend(pageId) {
    const page = pageId == null ? null : this.#pages.get(pageId);
    if (page == null) {
      return null;
    }
    return this.#pageHasCapability(page, "prefersFuseboxFrontend");
  }
  dangerouslyGetSocket() {
    return this.#deviceSocket;
  }
  #logFuseboxConsoleNotice() {
    if (fuseboxConsoleNoticeLogged) {
      return;
    }
    this.#deviceEventReporter?.logFuseboxConsoleNotice();
    fuseboxConsoleNoticeLogged = true;
  }
}
exports.default = Device;
