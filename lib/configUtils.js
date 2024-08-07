const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const suffixConfig = {
  weapp: {
    global: "global",
    entrySuffix: {
      js: "ts",
      miniJs: "wxs",
      xml: "wxml",
      css: "scss",
    },
    compiledSuffix: {
      js: "js",
      css: "wxss",
      miniJs: "wxs",
      xml: "wxml",
    },
  },
  aliapp: {
    global: "my",
    entrySuffix: {
      js: "ts",
      css: "scss",
      miniJs: "sjs",
      xml: "axml",
    },
    compiledSuffix: {
      js: "js",
      css: "acss",
      miniJs: "sjs",
      xml: "axml",
    },
  },
};

function getSuffixConfig() {
  return suffixConfig[process.env.ZIU_BUILD_PLATFORM];
}

function getEntry() {
  const platform = process.env.ZIU_BUILD_PLATFORM;
  const source = process.env.ZIU_BUILD_FILE_SOURCE;
  const hasExtraSource = fs.existsSync(path.join(process.cwd(), `src/app.${source}.json`));
  const hasPlatformApp = fs.existsSync(path.join(process.cwd(), `src/app.${platform}.json`));
  const hasPlatformOutside = fs.existsSync(path.join(process.cwd(), `src/outside/**/*/app.${platform}.json`));
  let appPath = `src/app.json`;
  if (hasExtraSource) {
    appPath = `src/app.${source}.json`
  } else if (hasPlatformApp) {
    appPath = `src/app.${platform}.json`
  }
  return {
    app: appPath, // 该行固定格式
    outside: hasPlatformOutside ? `src/outside/**/*/app.${platform}.json` : `src/outside/**/*/app.json`,
  };
}

function getBuildArgv() {
  return minimist(process.argv.slice(2));
}

function isMockEnv() {
  const argv = getBuildArgv();
  return argv.mock || false;
}

module.exports = {
  getSuffixConfig,
  getEntry,
  getBuildArgv,
  isMockEnv,
};
