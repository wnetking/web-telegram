const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: Path.resolve(__dirname, '../src/scripts/index.js')
  },
  output: {
    path: Path.join(__dirname, '../dist'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: Path.resolve(__dirname, '../public'),
        to: 'public'
      },
      {
        from: Path.resolve(__dirname, '../1.2380cfa0e562e148fa50.worker.js'),
        to: '1.2380cfa0e562e148fa50.worker.js'
      },
      {
        from: Path.resolve(__dirname, '../2.2380cfa0e562e148fa50.worker.js'),
        to: '2.2380cfa0e562e148fa50.worker.js'
      },
      {
        from: Path.resolve(__dirname, '../2380cfa0e562e148fa50.worker.js'),
        to: '2380cfa0e562e148fa50.worker.js'
      },
      {
        from: Path.resolve(__dirname, '../20055872ef713744314c66976ab2e9cc.mem'),
        to: '20055872ef713744314c66976ab2e9cc.mem'
      },
      {
        from: Path.resolve(__dirname, '../b4b0d61282108a31908dd6b2dbd7067b.wasm'),
        to: 'b4b0d61282108a31908dd6b2dbd7067b.wasm'
      }
    ]),
    new HtmlWebpackPlugin({
      template: Path.resolve(__dirname, '../src/index.html'),
      favicon: './public/favicon.ico'
      // templateParameters: {
      //   assets: {
      //     publicPath: './'
      //   }
      // }
    })
  ],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          }
        }
      },
    ]
  }
};
