import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Layout, Card, TextField } from '@shopify/polaris'

const ProposalAddendums = ({ proposal, onChange }) => {
  const addendums = _.get(proposal, 'addendums')
  return (
    <Layout.AnnotatedSection
      title='Addendums'
      description='Add addendums to appear for this specific contract.'
      sectioned
    >
      <Card title={'Addendum'}>

        <Card.Section>
          <TextField
            value={addendums}
            onChange={onChange}
            type='text'
            multiline={8}
          />
        </Card.Section>
      </Card>
    </Layout.AnnotatedSection>
  )
}

ProposalAddendums.propTypes = {
  proposal: PropTypes.object,
  onChange: PropTypes.func
}

export default ProposalAddendums
