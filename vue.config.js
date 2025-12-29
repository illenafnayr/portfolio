const path = require("path");

module.exports = {
  // Use relative paths so it works in subfolders (temporary URL) and root domains
  publicPath: './',

  // Keep your SCSS global imports
  chainWebpack: config => {
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach(type =>
      addStyleResource(config.module.rule("scss").oneOf(type))
    );
  }
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [
        path.resolve(__dirname, "./src/styles/colors/*.scss"),
        path.resolve(__dirname, "./src/styles/mixins/*.scss"),
        path.resolve(__dirname, "./src/styles/variables/*.scss")
      ]
    });
}
