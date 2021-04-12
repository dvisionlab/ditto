module.exports = {
  chainWebpack: config => config.resolve.symlinks(false),
  runtimeCompiler: true,
  transpileDependencies: ["vuetify"]
};
