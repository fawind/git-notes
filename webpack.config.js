const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  entry: path.resolve(__dirname, 'src/App.tsx'),
  htmlEntry: path.resolve(__dirname, 'src/index.html'),
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
};

module.exports = {
  entry: PATHS.entry,
  output: {
    path: PATHS.dist,
    filename: '[name].[hash].js',
  },
  resolve: {
    alias: {
      '@src': PATHS.src,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ['src', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: PATHS.htmlEntry,
    }),
  ],
  devServer: {
    disableHostCheck: true,
  },
};
