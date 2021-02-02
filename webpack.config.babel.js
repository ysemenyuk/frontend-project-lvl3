import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  mode: 'development',
  target: 'node',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve('public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin(),
  ],
};
