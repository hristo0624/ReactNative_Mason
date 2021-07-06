import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Page, Layout, PageActions } from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import PreviewWrapper from 'documents/PreviewWrapper'
import Proposal from 'documents/Proposal'
import PreivewContainer from 'documents/components/PreviewContainer'
import { saveProposal, sendProposal } from 'controllers/data'
import history from 'src/history'

class ProposalPreview extends Component {
  send = async () => {
    console.log('send')
    const { dispatch, proposal, account } = this.props
    console.log('proposal', proposal)
    await saveProposal(account.id, proposal)
    dispatch(sendProposal(account.id, proposal.id))
    history.push('/proposals')
  }

  open = async () => {
    console.log('open')
    const { proposal, account } = this.props
    console.log('proposal', proposal)
    const proposalUrl = await saveProposal(account.id, proposal)
    if (!_.isNil(proposalUrl)) window.open(proposalUrl)
    history.push('/proposals')
  }

  back = () => {
    console.log('back')
    const { back } = this.props
    back()
  }

  renderContent () {
    const { proposal } = this.props
    console.log('renderProposal preview', proposal)
    return (
      <Layout>
        <Layout.Section>
          <PreivewContainer>
            <PreviewWrapper>
              <Proposal
                {...proposal}
              />
            </PreviewWrapper>
          </PreivewContainer>
        </Layout.Section>
      </Layout>
    )
  }

  render () {
    return (
      <PageLayout>
        <Page
          separator
          breadcrumbs={[{ content: 'Edit', onAction: this.back }]}
          title='Proposal preview'
          primaryAction={{ content: 'Send', onAction: this.send }}
          secondaryActions={[{ content: 'Open', onAction: this.open }]}
        >
          {this.renderContent()}
          <PageActions
            primaryAction={{ content: 'Send', onAction: this.send }}
            secondaryActions={[{ content: 'Edit', onAction: this.back }]}
          />
        </Page>
      </PageLayout>
    )
  }
}

ProposalPreview.propTypes = ({
  back: PropTypes.func,
  proposal: PropTypes.object
})

const mapStateToProps = state => ({
  user: state.user,
  plans: _.get(state, 'references.plans', {}),
  account: state.account
})

export default connect(mapStateToProps)(ProposalPreview)
