import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Layout, Card, TextField, FormLayout } from '@shopify/polaris'

const ProjectTimeline = ({ proposal, handleChange, errors, resetError }) => {
  const startDate = _.get(proposal, 'startDate')
  const endDate = _.get(proposal, 'endDate')
  return (
    <Layout.AnnotatedSection
      title='Project timeline'
      description='Enter estimated start and completion dates for this project.  '
      sectioned
    >
      <Card>

        <Card.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                value={startDate}
                onChange={handleChange('startDate')}
                type='date'
                label='Approximate start date'
                helpText='When you estimate the project will be started'
                onFocus={resetError('startDate')}
                error={_.get(errors, 'startDate')}
              />
              <TextField
                value={endDate}
                onChange={handleChange('endDate')}
                type='date'
                label='Approximate completion date'
                helpText='Estimated date the project will be completed'
                onFocus={resetError('endDate')}
                error={_.get(errors, 'endDate')}
              />
            </FormLayout.Group>
          </FormLayout>

        </Card.Section>
      </Card>
    </Layout.AnnotatedSection>
  )
}

ProjectTimeline.propTypes = {
  proposal: PropTypes.object,
  errors: PropTypes.object,
  handleChange: PropTypes.func,
  resetError: PropTypes.func
}

export default ProjectTimeline
