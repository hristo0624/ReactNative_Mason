import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import AppWrapperHot from 'src/AppWrapperHot'
import '@shopify/polaris/styles.css'
import { AppProvider } from '@shopify/polaris'

import store from 'model/store'
import { appInitialized } from 'controllers/init'

const rootElement = document.querySelector('react')

const appRender = Component => {
  render(
    <Provider store={store} >
      <AppProvider>
        <Component />
      </AppProvider>
    </Provider>,
    rootElement
  )
}

appRender(AppWrapperHot)

store.dispatch(appInitialized())
