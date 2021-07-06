const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const projectPath = path.resolve(process.cwd(), '../')
module.exports = {
  target: 'node',
  node: {
    __dirname: false
  },
  entry: ['./src/index.js'],
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'this',
    filename: './index.js',
    path: path.resolve(projectPath, 'functions/')
  },
  mode: 'development',
  module: {
    rules: [{
      test: /.js$/,
      exclude: [ /node_modules/, path.resolve(projectPath, 'functions/src/index.js') ],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              ['@babel/plugin-transform-runtime', {
                'absoluteRuntime': false,
                'corejs': false,
                'helpers': false,
                'regenerator': true,
                'useESModules': false
              }]
            ]
          }
        }
      ]
    }]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'src': path.resolve(projectPath, 'webapp/src'),
      'constants': path.resolve(projectPath, 'webapp/src/constants'),
      'shared': path.resolve(projectPath, 'shared')
    }
  }
}
