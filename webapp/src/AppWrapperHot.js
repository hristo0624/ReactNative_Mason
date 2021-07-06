import { hot, setConfig } from 'react-hot-loader'
import React from 'react'

import App from './App'

const WrappedApp = () => (
  <App />
)

let ExportedApp = WrappedApp

if (module.hot) {
  setConfig({ logLevel: 'debug' })
  ExportedApp = hot(module)(WrappedApp)
}

export default ExportedApp
