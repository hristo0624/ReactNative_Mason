import { hot, setConfig } from 'react-hot-loader'
import React from 'react'

import App from 'workordersrc/App'
import AppTheme from 'components/AppTheme'

const WrappedApp = () => (
  <AppTheme>
    <App />
  </AppTheme>
)

let ExportedApp = WrappedApp

if (module.hot) {
  setConfig({ logLevel: 'debug' })
  ExportedApp = hot(module)(WrappedApp)
}

export default ExportedApp
