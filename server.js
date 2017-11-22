var config = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry.examples.unshift("webpack-dev-server/client?http://localhost:8000/");
config.entry.examples.unshift("webpack/hot/dev-server?reload=true");

var server = new WebpackDevServer(webpack(config), {
  contentBase: 'dist/',
  publicPath: '/',
  hot: true
});

server.listen(8000);