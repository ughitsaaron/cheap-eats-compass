const { join } = require('path');

const client = {
  name: 'client',
  mode: 'development',
  entry: join(__dirname, 'app.js'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: join(__dirname),
    compress: true,
    open: true,
    port: 8000,
    host: 'localhost'
  },
  output: {
    pathinfo: true,
    filename: 'bundle.js',
    path: join(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  }
};

if (process.env.NODE_ENV === 'production') {
  delete client.devtool;

  client.mode = 'production';
}

module.exports = [client];
