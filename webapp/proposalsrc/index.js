import React from 'react'
import { render } from 'react-dom'
import AppWrapperHot from 'proposalsrc/AppWrapperHot'
import '@shopify/polaris/styles.css'
import { AppProvider } from '@shopify/polaris'

const rootElement = document.querySelector('react')

const appRender = Component => {
  render(
    <AppProvider>
      <Component />
    </AppProvider>,
    rootElement
  )
}

appRender(AppWrapperHot)
