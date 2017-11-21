var config = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

config.entry.examples.unshift("webpack-dev-server/client?http://localhost:8080/");

var server = new WebpackDevServer(webpack(config), {
  contentBase: 'dist/',
  publicPath: '/'
});

server.listen(8000);