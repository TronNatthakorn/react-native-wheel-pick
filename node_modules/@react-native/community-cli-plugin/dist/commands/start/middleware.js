"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.createDevServerMiddleware = void 0;
const debug = require("debug")("ReactNative:CommunityCliPlugin");
const unusedStubWSServer = {};
const unusedMiddlewareStub = {};
const communityMiddlewareFallback = {
  createDevServerMiddleware: (params) => ({
    middleware: unusedMiddlewareStub,
    websocketEndpoints: {},
    messageSocketEndpoint: {
      server: unusedStubWSServer,
      broadcast: (method, _params) => {},
    },
    eventsSocketEndpoint: {
      server: unusedStubWSServer,
      reportEvent: (event) => {},
    },
  }),
};
try {
  const communityCliPath = require.resolve("@react-native-community/cli");
  const communityCliServerApiPath = require.resolve(
    "@react-native-community/cli-server-api",
    {
      paths: [communityCliPath],
    }
  );
  const communityCliServerApi = require(communityCliServerApiPath);
  communityMiddlewareFallback.createDevServerMiddleware =
    communityCliServerApi.createDevServerMiddleware;
} catch {
  debug(`⚠️ Unable to find @react-native-community/cli-server-api
Starting the server without the community middleware.`);
}
const createDevServerMiddleware = (exports.createDevServerMiddleware =
  communityMiddlewareFallback.createDevServerMiddleware);
