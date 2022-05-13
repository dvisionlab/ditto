module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        // not present by default
        fs: false,
        path: false
      }
    }
  },
  runtimeCompiler: true,
  transpileDependencies: ["vuetify"]
};
