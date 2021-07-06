const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const parts = require('./webpack.parts')
const path = require('path')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const projectPath = path.resolve(process.cwd(), './')
const rimraf = require('rimraf')
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')

const commonConfig = merge([
  {
    entry: [
      './src/index.js'
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.jsx?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack']
        }
      ]
    },
    resolve: {
      modules: [path.resolve(projectPath, 'node_modules')],
      extensions: ['*', '.js', '.jsx'],
      alias: {
        'assets': path.resolve(projectPath, 'assets'),
        'src': path.resolve(projectPath, 'src'),
        'pages': path.resolve(projectPath, 'src/pages'),
        'components': path.resolve(projectPath, 'src/components'),
        'controllers': path.resolve(projectPath, 'src/controllers'),
        'utils': path.resolve(projectPath, 'src/utils'),
        'styles': path.resolve(projectPath, 'src/styles'),
        'constants': path.resolve(projectPath, 'src/constants'),
        'model': path.resolve(projectPath, 'src/model'),
        'documents': path.resolve(projectPath, 'src/documents'),
        'shared': path.resolve(projectPath, '../shared'),

      }
    },
    plugins: [
      // new FaviconsWebpackPlugin({
      //   logo: '../expo-app/assets/icon.png',
      //   title: 'Friday',
      //   icons: {
      //     android: true,
      //     appleIcon: true,
      //     appleStartup: false,
      //     coast: false,
      //     favicons: true,
      //     firefox: true,
      //     opengraph: false,
      //     twitter: false,
      //     yandex: false,
      //     windows: false
      //   }
      // }),
      new HtmlWebpackPlugin({
        title: 'Liens',
        template: 'src/template.html'
      })
    ]
  }
])

const productionConfig = merge([
  parts.extractCSS({
    use: [parts.autoprefix()]
  }),
  parts.loadImages({
    options: {
      limit: 1024,
      name: '[name].[ext]'
    }
  }),
  parts.loadSVG(),
  {
    mode: 'production',
    output: {
      filename: '[name].[chunkhash].js',
      path: path.resolve(projectPath, 'dist'),
      publicPath: '/',
      chunkFilename: '[name].[chunkhash].js'
    },
    plugins: [
      new CleanWebpackPlugin({
        root: projectPath,
        verbose: true,
        dry: false
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css',
        chunkFilename: '[id].[hash].css'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  }
])

const developmentConfig = merge([
  parts.loadCSS(),
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
    contentBase: path.resolve(projectPath, 'dist')
  }),
  parts.loadImages({
    options: {
      limit: 1024,
      name: '[name].[ext]'
    }
  }),
  parts.loadSVG(),
  {
    // devtool: 'source-map',
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: path.resolve(projectPath, 'dist'),
      publicPath: '/',
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js'
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      })
    ]
  }
])

const checkUnusedConfig = merge([
  {
    plugins: [
      new UnusedFilesWebpackPlugin({
        globOptions: {
          ignore: [
            'node_modules/**/*',
            'webpack**',
            'dist/**',
            'assets/**',
            'yarn.lock']
        }
      })
    ]
  }
])

module.exports = env => {
  console.log('env:', env)
  if (env && env.check_unused) {
    return merge(commonConfig, developmentConfig, checkUnusedConfig)
  } else if (env && env.production) {
    rimraf.sync(productionConfig.output.path)
    return merge(commonConfig, productionConfig)
  }
  return merge(commonConfig, developmentConfig)
}
