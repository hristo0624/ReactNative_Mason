import ReactDOMServer from 'react-dom/server'
import React from 'react'
import pdf from 'html-pdf'
import { ServerStyleSheet } from 'styled-components'

import PreviewWrapper from 'src/documents/PreviewWrapper'
import Contract from 'src/documents/Contract'

import template from './template'

function createPdfStreamAsync (html, options = {}) {
  const opts = {
    format: 'Letter',
    ...options
  }
  return new Promise((resolve, reject) => {
    pdf.create(html, opts).toStream((err, buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(buffer)
      }
    })
  })
}

function createPdfBufferAsync (html, options) {
  const opts = {
    format: 'Letter',
    ...options
  }
  return new Promise((resolve, reject) => {
    pdf.create(html, opts).toBuffer((err, buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(buffer)
      }
    })
  })
}

function makeTemplatedHtmlContract (props) {
  const sheet = new ServerStyleSheet()
  const body = ReactDOMServer.renderToString(sheet.collectStyles(
    <PreviewWrapper>
      <Contract {...props} />
    </PreviewWrapper>
  ))
  const styles = sheet.getStyleTags()
  return template({
    body: body,
    stylesheet: styles
  })
}

export default {
  createPdfStreamAsync,
  makeTemplatedHtmlContract,
  createPdfBufferAsync
}
