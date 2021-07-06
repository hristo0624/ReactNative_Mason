import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Card,
  ResourceList,
  Stack,
  TextStyle,
  EmptyState,
  Badge,
  Modal,
  TextContainer
} from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import history from 'src/history'
import * as roles from 'constants/roles'
import * as proposalStatuses from 'constants/proposalStatuses'
import { deleteProposal } from 'controllers/data'
import config from 'src/config'

class Proposals extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      confirmationModalVisible: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { account } = props
    if (account !== state.account) {
      return {
        account,
        items: _.values(_.get(account, 'proposalsInfo'))
      }
    }
    return null
  }

  showPreview = id => () => {
    const { account } = this.props
    window.open(`${config.proposalUrl}/${account.id}/${id}`)
  }

  editProposal = id => () => {
    history.push({
      pathname: '/proposal/create',
      state: {
        parentProposalId: id
      }
    })
  }

  deleteProposalPrompt = id => () => {
    this.setState({ proposalId: id })
    this.showConfirmationModal()
  }

  deleteProposal = async () => {
    const { proposalId } = this.state
    await deleteProposal(proposalId)
    this.hideConfirmationModal()
  }

  hasRights = () => {
    const { account, user } = this.props
    return _.get(account, ['admins', _.get(user, 'id'), 'role']) === roles.OWNER
  }

  getStatusBadgeProps = status => {
    switch (status) {
      case proposalStatuses.NEW:
        return { status: 'new', progress: 'incomplete' }
      case proposalStatuses.ACCEPTED:
        return { status: 'info', progress: 'partiallyComplete' }
      case proposalStatuses.SIGNED:
        return { status: 'success', progress: 'complete' }
      default:
        return { status: 'default' }
    }
  }

  renderItem = item => {
    const { id, owner, address, description, status, projectCost } = item
    const viewAction = { icon: 'view', onAction: this.showPreview(id) }
    const shortcutActions = [ viewAction ]
    if (this.hasRights()) {
      const editAction = { content: 'Edit', onAction: this.editProposal(id) }
      const deleteAction = { icon: 'delete', onAction: this.deleteProposalPrompt(id) }
      shortcutActions.unshift(editAction)
      shortcutActions.unshift(deleteAction)
    }
    return (
      <ResourceList.Item
        id={id}
        onClick={this.showPreview(id)}
        shortcutActions={shortcutActions}
      >
        <Stack distribution='fillEvenly'>

          <h3>
            <TextStyle variation='strong'>
              {`${_.get(owner, 'firstName', '')} ${_.get(owner, 'lastName', '')}`}
            </TextStyle>
          </h3>
          <div>{_.get(address, 'description', '')}</div>
          <div>{description}</div>
          <Badge {...this.getStatusBadgeProps(status)}>{_.capitalize(status)}</Badge>
          <div>${projectCost}</div>
        </Stack>
      </ResourceList.Item>
    )
  }

  renderEmptyState = () => {
    return (
      <EmptyState
        heading='There is no proposal yet'
        action={{ content: 'Create proposal', onAction: this.toCreateProposal }}
        image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
      >
        <p>Create your first proposal and send it to you customer via SMS or email.</p>
      </EmptyState>
    )
  }

  renderContent () {
    const { items } = this.state
    if (items.length === 0) {
      return this.renderEmptyState()
    } else {
      const resourceName = {
        singular: 'proposal',
        plural: 'proposals'
      }
      return (
        <Card>
          <ResourceList
            resourceName={resourceName}
            items={items}
            renderItem={this.renderItem}
          />
        </Card>
      )
    }
  }

  toCreateProposal = () => {
    history.push('/proposal/create')
  }

  showConfirmationModal = () => {
    this.setState({ confirmationModalVisible: true })
  }

  hideConfirmationModal = () => {
    this.setState({ confirmationModalVisible: false })
  }

  renderConfirmationModal = () => {
    const { confirmationModalVisible } = this.state
    return (
      <Modal
        open={confirmationModalVisible}
        onClose={this.hideConfirmationModal}
        title={'Delete proposal'}
        primaryAction={{ content: 'Confirm', onAction: this.deleteProposal }}
        secondaryActions={[{ content: 'Cancel', onAction: this.hideConfirmationModal }]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure you want delete this proposal?
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    )
  }

  render () {
    return (
      <PageLayout>
        <Page
          separator
          fullWidth
          title={'Proposals'}
          primaryAction={{ content: 'Create proposal', onAction: this.toCreateProposal }}
        >
          {this.renderContent()}
          {this.renderConfirmationModal()}
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account
})

export default connect(mapStateToProps)(Proposals)
