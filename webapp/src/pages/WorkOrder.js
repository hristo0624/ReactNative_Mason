import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Layout,
  Card,
  Badge,
  Subheading,
  Stack,
  Button,
  TextStyle
} from '@shopify/polaris'
import generate from 'firebase-auto-ids'

import PageLayout from 'components/pageStructure/PageLayout'
import history from 'src/history'
import ProposalPreview from 'pages/ProposalPreview'
import Bids from 'components/workOrder/Bids'
import InvitedSubs from 'components/workOrder/InvitedSubs'
import AddSubModal from 'components/subcontractors/AddSubModal'
import * as bidStatuses from 'constants/bidStatuses'
import * as workOrderStatuses from 'constants/workOrderStatuses'
import folderPlus from 'assets/icons/folder-plus.svg'
import exchange from 'assets/icons/exchange.svg'

class WorkOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      workOrder: {
        id: generate(_.now()),
        subs: [],
        num: 1234,
        status: workOrderStatuses.BIDDING,
        workTypes: [ 'Electrical', 'Roofing', 'Drywall' ],
        jobDescription: 'Demo and remodel kitchen. New tile on countertops, marble island, Boffe appliances, Subzero refrigerator. Wood flooring. Recessed lighting.'
      },
      subsToInvite: [],
      inviteModalVisible: false
    }
  }

  showInviteModal = () => this.setState({ inviteModalVisible: true })
  hideInviteModal = () => this.setState({ inviteModalVisible: false })

  handleChange = fieldName => v => {
    const { workOrder } = this.state
    this.setState({
      workOrder: {
        ...workOrder,
        [fieldName]: v
      }
    })
  }

  handleChangeSubsToInvite = subsToInvite => {
    this.setState({ subsToInvite })
  }

  back = () => {
    history.push('/workOrders')
  }

  toCreateWorkOrder = () => {
    history.push('/workOrder/create')
  }

  toCreateChangeOrder = () => {
    // TODO
  }

  inviteSubs = () => {
    const { subsToInvite } = this.state
    // TODO: send invites to subs, add subs to workOrder's subs list
    this.setState({ subsToInvite: [] })
    this.hideInviteModal()
  }

  renderStatus = () => {
    const { workOrder } = this.state
    const status = _.get(workOrder, 'status')
    return <Badge>{_.capitalize(status)}</Badge>
  }

  renderDetails = () => {
    const { workOrder } = this.state
    return (
      <Card title='Work order details' actions={[{ content: 'Edit' }]}>
        <Card.Section title='Work type(s)'>
          <TextStyle variation='subdued'>
            {_.map(_.get(workOrder, 'workTypes'), wtype => <p key={wtype}>{wtype}</p>)}
          </TextStyle>
        </Card.Section>
        <Card.Section>
          <Stack>
            <Stack.Item fill>
              <Subheading>Job description</Subheading>
            </Stack.Item>
            <Button plain>Edit</Button>
          </Stack>
          <TextStyle variation='subdued'>
            <p>
              {_.get(workOrder, 'jobDescription')}
            </p>
          </TextStyle>
        </Card.Section>
        <Card.Section>
          <Stack>
            <Stack.Item fill>
              <Subheading>Status</Subheading>
            </Stack.Item>
            {this.renderStatus()}
          </Stack>
        </Card.Section>
      </Card>
    )
  }

  renderContent () {
    const { bids, subs } = this.props
    return (
      <Layout>
        <Layout.Section>
          <Bids bids={bids} onInvite={this.showInviteModal} />
          <InvitedSubs subs={subs} />
        </Layout.Section>
        <Layout.Section secondary>
          {this.renderDetails()}
        </Layout.Section>
      </Layout>
    )
  }

  renderInviteSubsModal = () => {
    const { inviteModalVisible, subsToInvite } = this.state
    return (
      <AddSubModal
        title='Add a subcontractor to this project'
        items={subsToInvite}
        visible={inviteModalVisible}
        onChange={this.handleChangeSubsToInvite}
        onClose={this.hideInviteModal}
        onAction={this.inviteSubs}
      />
    )
  }

  render () {
    const { showPreview, proposal, workOrder } = this.state
    const num = _.get(workOrder, 'num')
    if (showPreview) {
      return <ProposalPreview back={this.togglePreview} proposal={proposal} />
    } else {
      return (
        <PageLayout>
          <Page
            separator
            breadcrumbs={[{ content: 'Project', onAction: this.back }]}
            title={`Work order #${num}`}
            titleMetadata={this.renderStatus()}
            pagination={{
              hasPrevious: true,
              hasNext: true
            }}
            secondaryActions={[
              {
                content: 'Add work order',
                icon: folderPlus,
                onAction: this.toCreateWorkOrder
              },
              {
                content: 'Add change order',
                icon: exchange,
                onAction: this.toCreateChangeOrder
              },
              {
                content: 'More actions',
                icon: 'caretDown'
              }
            ]}
          >
            {this.renderContent()}
            <Layout.Section />
          </Page>
          {this.renderInviteSubsModal()}
        </PageLayout>
      )
    }
  }
}

WorkOrder.defaultProps = {
  bids: [...Array(5).keys()].reduce((obj, idx) => {
    obj[`bid${idx}`] = {
      id: `bid${idx}`,
      subId: `sub${idx}`,
      subName: 'Subcontractor name',
      bid: 700,
      note: 'Note: This includes all wires…'
    }
    return obj
  }, {}),
  subs: {
    id0: {
      id: 'id0',
      name: 'Subcontractor name',
      phone: '818-392-2911',
      status: bidStatuses.UNOPENED
    },
    id1: {
      id: 'id1',
      name: 'Subcontractor name',
      phone: '818-392-2911',
      status: bidStatuses.OPENED
    },
    id2: {
      id: 'id2',
      name: 'Subcontractor name',
      phone: '818-392-2911',
      status: bidStatuses.NO_BID
    },
    id3: {
      id: 'id3',
      name: 'Subcontractor name',
      phone: '818-392-2911',
      status: bidStatuses.REJECTED
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  plans: _.get(state, 'references.plans', {}),
  references: state.references,
  account: state.account
})

export default connect(mapStateToProps)(WorkOrder)
