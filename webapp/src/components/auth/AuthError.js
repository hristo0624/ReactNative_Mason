import React from 'react'
import { Banner, Layout } from '@shopify/polaris'
import _ from 'lodash'

const AuthError = ({ error }) => {
  if (!_.isNil(error)) {
    return (
      <Layout.Section>
        <Banner
          title='Authorization Error'
          status='critical'
        >
          <p>{error}</p>
        </Banner>
      </Layout.Section>
    )
  } else {
    return null
  }
}

export default AuthError
