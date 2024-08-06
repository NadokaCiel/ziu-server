const path = require("path"),
  fs = require("fs"),
  glob = require("globby"),
  YAML = require("yaml"),
  merge = require("lodash.merge");

let version = "";

try {
  version = process.env.npm_package_version;
} catch (e) {
  console.error(e);
}

const source = process.env.ZIU_BUILD_FILE_SOURCE;

const cwd = path.join(process.cwd(), "config"),
  globConfig = {
    cwd,
    root: "/",
  },
  PRJ_ENV = process.env.PRJ_ENV || process.env.NODE_ENV || "production";

const hasSourceDefaultConfig = source ? fs.existsSync(path.join(process.cwd(), `config/default.${source}.*(yaml|yml)`)) : false;
const defaultEnvPath = hasSourceDefaultConfig ? glob.sync(`default.${source}.*(yaml|yml)`, globConfig)[0] || "" : glob.sync(`default.*(yaml|yml)`, globConfig)[0] || "";

if (!defaultEnvPath) {
  throw new Error(`config dir must include default.yml or default.yaml`);
}

const hasSourceEnvConfig = source ? fs.existsSync(path.join(process.cwd(), `config/${PRJ_ENV}.${source}.*(yaml|yml)`)) : false;

const defaultEnv = getEnvData(defaultEnvPath, cwd),
  envFile = hasSourceEnvConfig ? glob.sync(`${PRJ_ENV}.${source}.*(yaml|yml)`, globConfig)[0] || "" : glob.sync(`${PRJ_ENV}.*(yaml|yml)`, globConfig)[0] || "",
  env = getEnvData(envFile, cwd),
  envMergeData = merge(
    {
      PRJ_ENV,
      VERSION: version,
    },
    defaultEnv,
    env,
  );

function getEnvData(url = "", envFileCwd = process.cwd()) {
  if (!url) {
    return {};
  }
  return YAML.parse(fs.readFileSync(path.join(envFileCwd, url || ""), "utf8"));
}

module.exports = JSON.stringify(envMergeData);
