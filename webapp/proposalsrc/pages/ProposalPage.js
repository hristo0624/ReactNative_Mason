import React from 'react'
import PropTypes from 'prop-types'
import { Page, Badge } from '@shopify/polaris'
import _ from 'lodash'

import PreviewWrapper from 'documents/PreviewWrapper'
import Proposal from 'documents/Proposal'
import PreivewContainer from 'documents/components/PreviewContainer'

const ProposalPage = ({ proposal, onAgree }) => {
  const titleMetadata = proposal.accepted ? <Badge status='success'>Accepted</Badge> : <Badge status='default'>Waiting for review</Badge>
  let actionTitle = 'Accept'
  if (_.has(proposal, 'ownerContractSignature')) {
    actionTitle = 'To contract'
  } else if (proposal.accepted) {
    actionTitle = 'Sign contract'
  }
  return (
    <Page
      title='Proposal'
      titleMetadata={titleMetadata}
      primaryAction={{ content: actionTitle, onAction: onAgree }}
    >
      <PreivewContainer>
        <PreviewWrapper>
          <Proposal
            {...proposal}
          />
        </PreviewWrapper>
      </PreivewContainer>
    </Page>
  )
}

ProposalPage.propTypes = {
  proposal: PropTypes.object,
  onAgree: PropTypes.func
}

export default ProposalPage
