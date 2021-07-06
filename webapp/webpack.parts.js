const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.devServer = ({ host, port, ...rest } = {}) => ({
  devServer: {
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    open: true,
    overlay: true,
    contentBase: './dist',
    // hot: true,
    historyApiFallback: true,
    ...rest
  }
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        include,
        exclude,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
})

exports.extractCSS = ({ include, exclude, use } = {}) => ({
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        include,
        exclude,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          ...use
        ]
      }
    ]
  }
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => [require('autoprefixer')()]
  }
})

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|otf|ttf|woff2|woff)$/,
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options
        }
      }
    ]
  }
})

exports.loadSVG = () => ({
  module: {
    rules: [
      { test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack'
          }
        ]
      }
    ]
  }
})
