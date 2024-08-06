module.exports = function getFirstExtensions() {
  const platform = process.env.ZIU_BUILD_PLATFORM;
  const source = process.env.ZIU_BUILD_FILE_SOURCE;

  /**
   * 指定项目文件后缀，优先于平台后缀寻址
   */
  const sourceFileExts = source ? [`.${source}.ts`, `.${source}.js`] : [];

  if (platform === "weapp") {
    return [...sourceFileExts, ".weapp.ts", ".weapp.js"];
  }

  if (platform === "aliapp") {
    return [...sourceFileExts, ".aliapp.ts", ".aliapp.js"];
  }

  if (platform === "swan") {
    return [...sourceFileExts, ".swan.ts", ".swan.js"];
  }

  if (platform === "tt") {
    return [...sourceFileExts, ".tt.ts", ".tt.js"];
  }

  return [...sourceFileExts];
};
