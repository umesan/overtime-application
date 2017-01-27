const path = require('path')
const webpack = require('webpack')
const cssnano = require('cssnano')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')

const env = process.env.NODE_ENV || 'development'

const DEV = env === 'development'
const BOOKMARKLET = process.env.TARGET === 'bookmarklet'
const globals = {
  '__DEV__': DEV,
  '__BOOKMARKLET__': BOOKMARKLET,
}
const conf = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(
      __dirname,
      (DEV
        ? 'dist'
        : (BOOKMARKLET
          ? 'docs'
          : 'chrome_extension'
        )
      )
    ),
    filename: '[name].min.js'
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          cssnano({
            autoprefixer : {
              add      : true,
              remove   : true,
              browsers : ['last 2 versions']
            },
            discardComments : {
              removeAll : true
            },
            discardUnused : false,
            mergeIdents   : false,
            reduceIdents  : false,
            safe          : true,
            sourcemap     : true
          })
        ]
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test    : /\.scss$/,
        loaders : [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  },
}

if (BOOKMARKLET) {
  conf.entry = {
    'export': './bookmarklet_core/export',
    'import': './bookmarklet_core/import',
  }
}
else {
  conf.entry = {
    content: './chrome_extension/js/content',
  }

  conf.plugins.push(
    new CopyWebpackPlugin([
      {
        from: 'chrome_extension/',
        ignore: [
          'css/**',
          'js/**',
          'webstore/**',
        ]
      },
    ])
  )
}

if (DEV) {
  conf.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      { from: 'mockup/'  },
    ]),
    ...(
      BOOKMARKLET
      ? []
      : [
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src', 'mockup', 'timesheet.html'),
          filename: 'timesheet.html',
          chunks: ['content']
        }),
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src', 'mockup', 'overtime_report.html'),
          filename: 'overtime_report.html',
          chunks: ['content']
        }),
      ]
    ),
    new WriteFilePlugin()
  )
} else {
  conf.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        unused    : true,
        dead_code : true,
        warnings  : false
      }
    })
  )
}

module.exports = conf
