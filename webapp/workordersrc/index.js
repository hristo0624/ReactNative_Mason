import React from 'react'
import { render } from 'react-dom'
import AppWrapperHot from 'workordersrc/AppWrapperHot'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f4f6f8;
  }
`
const rootElement = document.querySelector('react')

const appRender = Component => {
  render(
    <React.Fragment>
      <GlobalStyle />
      <Component />
    </React.Fragment>,
    rootElement
  )
}

appRender(AppWrapperHot)
