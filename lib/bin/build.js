const getEntry = require("mini-entry");
const webpackBuild = require("../webpack/webpack.config");

function build(config) {
  const { entry, jsonFiles, subPackagesDir } = getEntry({
    platform: process.env.ZIU_BUILD_PLATFORM,
    fileSource: process.env.ZIU_BUILD_FILE_SOURCE,
    ...config,
  });

  webpackBuild(
    { entry, jsonFiles, subPackagesDir },
    {
      clean: true,
      buildConfig: config,
    },
  ).run((err, stats) => {
    if (err) {
      throw err;
    }
    console.log(
      stats.toString({
        all: false,
        timings: false,
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      }),
    );
  });
}

module.exports = build;
