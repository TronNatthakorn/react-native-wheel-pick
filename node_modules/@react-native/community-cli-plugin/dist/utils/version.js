"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = getLatestRelease;
exports.logIfUpdateAvailable = logIfUpdateAvailable;
var _chalk = _interopRequireDefault(require("chalk"));
var _semver = _interopRequireDefault(require("semver"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
const debug = require("debug")("ReactNative:CommunityCliPlugin");
async function logIfUpdateAvailable(cliConfig, reporter) {
  const { reactNativeVersion: currentVersion } = cliConfig;
  let newVersion = null;
  try {
    const upgrade = await getLatestRelease(currentVersion);
    if (upgrade) {
      newVersion = upgrade;
    }
  } catch (e) {
    debug(
      "Cannot detect current version of React Native, " +
        "skipping check for a newer release"
    );
    debug(e);
  }
  if (newVersion == null) {
    return;
  }
  if (_semver.default.gt(newVersion.stable, currentVersion)) {
    reporter.update({
      type: "unstable_server_log",
      level: "info",
      data: `React Native v${
        newVersion.stable
      } is now available (your project is running on v${currentVersion}).
Changelog: ${_chalk.default.dim.underline(newVersion?.changelogUrl ?? "none")}
Diff: ${_chalk.default.dim.underline(newVersion?.diffUrl ?? "none")}
`,
    });
  }
}
function isDiffPurgeEntry(data) {
  return (
    [data.name, data.zipball_url, data.tarball_url, data.node_id].filter(
      (e) => typeof e !== "undefined"
    ).length === 0
  );
}
async function getLatestRelease(currentVersion) {
  debug("Checking for a newer version of React Native");
  try {
    debug(`Current version: ${currentVersion}`);
    if (["-canary", "-nightly"].some((s) => currentVersion.includes(s))) {
      return;
    }
    debug("Checking for newer releases on GitHub");
    const latestVersion = await getLatestRnDiffPurgeVersion();
    if (latestVersion == null) {
      debug("Failed to get latest release");
      return;
    }
    const { stable, candidate } = latestVersion;
    debug(`Latest release: ${stable} (${candidate ?? ""})`);
    if (_semver.default.compare(stable, currentVersion) >= 0) {
      return {
        stable,
        candidate,
        changelogUrl: buildChangelogUrl(stable),
        diffUrl: buildDiffUrl(currentVersion, stable),
      };
    }
  } catch (e) {
    debug("Something went wrong with remote version checking, moving on");
    debug(e);
  }
}
function buildChangelogUrl(version) {
  return `https://github.com/facebook/react-native/releases/tag/v${version}`;
}
function buildDiffUrl(oldVersion, newVersion) {
  return `https://react-native-community.github.io/upgrade-helper/?from=${oldVersion}&to=${newVersion}`;
}
async function getLatestRnDiffPurgeVersion() {
  const resp = await fetch(
    "https://api.github.com/repos/react-native-community/rn-diff-purge/tags",
    {
      headers: {
        "User-Agent": "@react-native/community-cli-plugin",
      },
    }
  );
  const result = {
    stable: "0.0.0",
  };
  if (resp.status !== 200) {
    return;
  }
  const body = (await resp.json()).filter(isDiffPurgeEntry);
  for (const { name: version } of body) {
    if (result.candidate != null && version.includes("-rc")) {
      result.candidate = version.substring(8);
      continue;
    }
    if (!version.includes("-rc")) {
      result.stable = version.substring(8);
      return result;
    }
  }
  return result;
}
