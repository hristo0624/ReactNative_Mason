import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Page } from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'

class Dashboard extends Component {
  renderContent () {
    return <p>Dashboard content</p>
  }

  render () {
    return (
      <PageLayout>
        <Page separator fullWidth title='Dashboard'>
          {this.renderContent()}
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Dashboard)
