import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Page } from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'

class Clients extends Component {
  renderContent () {
    return <p>Clients content</p>
  }

  render () {
    return (
      <PageLayout>
        <Page separator fullWidth title='Clients'>
          {this.renderContent()}
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Clients)
