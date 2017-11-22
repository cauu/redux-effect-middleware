var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    examples: ['./examples/src'],
    'redux-effect-middleware': './src'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
    libraryTarget: 'var',
    library: 'ReduxEffectMiddleware',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'redux': 'Redux',
    'redux-effect-middleware': 'ReduxEffectMiddleware'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      filename: 'index.html',
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: { inline: true }
};