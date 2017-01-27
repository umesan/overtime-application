const WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    config = require("../webpack.config.babel"),
    env = require("./env"),
    path = require("path");

for (var entryName in config.entry) {
  config.entry[entryName] =
    [
      ("webpack-dev-server/client?http://localhost:" + env.PORT),
      "webpack/hot/dev-server"
    ].concat(config.entry[entryName]);
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

var compiler = webpack(config);
var server =
  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, "../dist"),
    headers: { "Access-Control-Allow-Origin": "*" }
  });

server.listen(env.PORT);
