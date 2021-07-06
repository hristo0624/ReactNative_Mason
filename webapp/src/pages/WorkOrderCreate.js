import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  ChoiceList,
  Select,
  PageActions,
  Tag,
  Stack
} from '@shopify/polaris'
import generate from 'firebase-auto-ids'

import PageLayout from 'components/pageStructure/PageLayout'
import history from 'src/history'
import ProposalPreview from 'pages/ProposalPreview'
import SubcontractorsList from 'components/subcontractors/SubcontractorsList'

const ASSIGN_SUB = 'assignSub'
const INVITE_SUBS_TO_BID = 'inviteSubsToBid'

class WorkOrderCreate extends Component {
  constructor (props) {
    super(props)
    console.log(generate(_.now()))
    this.state = {
      workOrder: {
        id: generate(_.now()),
        subcontractorsSetup: [INVITE_SUBS_TO_BID],
        subs: [],
        workTypes: []
      },
      workTypesOptions: []
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { workTypes } = props
    if (workTypes !== state.workTypes) {
      return {
        workTypes,
        workTypesOptions: _.map(workTypes, v => ({ label: v.title, value: v.id }))
      }
    }
    return null
  }

  handleChange = fieldName => v => {
    const { workOrder } = this.state
    this.setState({
      workOrder: {
        ...workOrder,
        [fieldName]: v
      }
    })
  }

  onAddWorkType = wtype => {
    const { workOrder } = this.state
    this.setState({
      selectedWorkType: wtype,
      workOrder: {
        ...workOrder,
        workTypes: [
          ..._.get(workOrder, 'workTypes', []),
          wtype
        ]
      }
    })
  }

  onRemoveWorkType = wtype => () => {
    const { workOrder } = this.state
    const workTypes = _.get(workOrder, 'workTypes')
    this.setState({
      workOrder: {
        ...workOrder,
        workTypes: _.filter(workTypes, wt => wtype !== wt)
      }
    })
  }

  createWorkOrder = () => {
    // TODO
    console.log('workOrder:', this.state.workOrder)
  }

  back = () => {
    history.push('/projects/active')
  }

  renderWorkType = wtype => {
    const { workTypes } = this.props
    return (
      <Tag key={wtype} onRemove={this.onRemoveWorkType(wtype)}>
        {_.get(workTypes, [ wtype, 'title' ])}
      </Tag>
    )
  }

  renderWorkOrder = () => {
    const { workOrder, selectedWorkType, workTypesOptions } = this.state
    const workTypes = _.get(workOrder, 'workTypes', [])
    return (
      <Layout.AnnotatedSection
        title='Work order'
        description='Shopify and your customers will use this information to contact you.'>
        <Card sectioned>
          <FormLayout>
            <Select
              label='Work type'
              options={workTypesOptions}
              value={selectedWorkType}
              onChange={this.onAddWorkType}
            />
            <Stack>{workTypes.map(this.renderWorkType)}</Stack>
            <TextField
              label='Job description'
              value={_.get(workOrder, 'jobDescription')}
              onChange={this.handleChange('jobDescription')}
              multiline={8}
            />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderSubsSection = () => {
    const { workOrder } = this.state
    const subcontractorsSetup = _.get(workOrder, ['subcontractorsSetup', 0])
    switch (subcontractorsSetup) {
      case ASSIGN_SUB:
      case INVITE_SUBS_TO_BID:
        return (
          <Card.Section>
            <SubcontractorsList
              label='Invite supplier'
              items={_.get(workOrder, 'subs', [])}
              onChange={this.handleChange('subs')}
            />
          </Card.Section>
        )
      default:
        return null
    }
  }

  renderSubcontractors = () => {
    const { workOrder } = this.state
    return (
      <Layout.AnnotatedSection
        title='Subcontractors to invite'
        description='This address will appear on your invoices. You can edit the address used to calculate shipping rates in your shipping settings'>
        <Card
          sectioned
          title='Subcontractor for work order'
          actions={[ { content: 'Create subcontractor' } ]}
        >
          <Card.Section>
            <ChoiceList
              choices={[
                { label: 'Assign a specific sub', value: ASSIGN_SUB },
                { label: 'Open to bids', value: 'openToBids' },
                { label: 'Invite subs to bid', value: INVITE_SUBS_TO_BID }
              ]}
              selected={_.get(workOrder, 'subcontractorsSetup')}
              onChange={this.handleChange('subcontractorsSetup')}
            />
          </Card.Section>
          {this.renderSubsSection()}
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderContent () {
    return (
      <Layout>
        {this.renderWorkOrder()}
        {this.renderSubcontractors()}
      </Layout>
    )
  }

  render () {
    const { showPreview, proposal } = this.state
    if (showPreview) {
      return (
        <ProposalPreview
          back={this.togglePreview}
          proposal={proposal}
        />
      )
    } else {
      return (
        <PageLayout>
          <Page
            separator
            breadcrumbs={[{ content: 'Project', onAction: this.back }]}
            title='Create new Work Order'
          >
            {this.renderContent()}
            <Layout.Section />
            <PageActions
              primaryAction={{ content: 'Create', onAction: this.createWorkOrder }}
              secondaryActions={[{ content: 'Discard', onAction: this.back }]}
            />
          </Page>
        </PageLayout>
      )
    }
  }
}

const mapStateToProps = state => ({
  workTypes: _.get(state, 'references.workTypes', {})
})

export default connect(mapStateToProps)(WorkOrderCreate)
