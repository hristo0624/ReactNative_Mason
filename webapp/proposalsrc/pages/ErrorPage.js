import React from 'react'
import { Page, Banner } from '@shopify/polaris'
import config from 'src/config'

const ErrorPage = ({ desc }) => (
  <Page>
    <Banner
      title='An error occurred'
      action={{ content: 'Contact support', url: `mailto:${config.supportEmail}` }}
      status='critical'
    >
      <p>{desc}</p>
    </Banner>
  </Page>
)

export default ErrorPage
