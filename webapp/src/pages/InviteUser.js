import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  FormLayout,
  TextField,
  Select,
  Card,
  ResourceList,
  Avatar,
  Modal,
  TextContainer,
  Badge,
  Stack
} from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import { sendInvite, changeRole, deleteMember } from 'controllers/auth'
import * as roles from 'constants/roles'
import history from 'src/history'

class InviteUser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roles: [],
      inviteModalVisible: false,
      inviteRole: roles.EMPLOYEE,
      selectRoleModalVisible: false,
      confirmationModalVisible: false,
      inviteError: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { references } = props
    if (references !== state.references) {
      const roles = _.map(_.get(references, 'roles'), (v, k) => ({
        label: _.get(v, 'title'),
        value: k
      }))
      return {
        roles,
        references
      }
    }
    return null
  }

  isOwner = () => {
    const { admins, user } = this.props
    return _.get(admins, [_.get(user, 'id'), 'role']) === roles.OWNER
  }

  handleChange = field => value => {
    this.setState({ [field]: value, inviteError: null })
  }

  renderEmailInput = field => (
    <TextField
      label='Email'
      type='email'
      value={this.state[field]}
      onChange={this.handleChange(field)}
    />
  )

  renderRoleSelect = () => {
    const { inviteRole, roles } = this.state
    return (
      <Select
        label='Role'
        options={roles}
        onChange={this.handleChange('inviteRole')}
        value={inviteRole}
      />
    )
  }

  deleteMemberPrompt = (memberId) => () => {
    console.log('deleteMember', memberId)
    this.setState({ memberId })
    this.openConfirmationModal()
  }

  onMemberClick = (memberId, role) => () => {
    this.setState({ memberId, inviteRole: role })
    this.openSelectRoleModal()
  }

  renderMember = (m) => {
    console.log('renderMember', m)
    const { user } = this.props
    const isOwner = this.isOwner()
    const isUserHimself = m.id === user.id
    const shortcutActions = (isOwner && !isUserHimself) ? [
      { icon: 'delete', onAction: this.deleteMemberPrompt(m.id) }
    ] : null
    const onClick = (isOwner && !isUserHimself) ? this.onMemberClick(m.id, m.role) : null
    return (
      <ResourceList.Item
        id={m.id}
        accessibilityLabel={`View details for`}
        media={<Avatar customer size='medium' name={m.email} />}
        shortcutActions={shortcutActions}
        onClick={onClick}
      >
        <Stack alignment='center' distribution='fill'>
          <Stack.Item>
            <p><b>{m.name}</b> {m.email}</p>
            <p>{_.capitalize(m.role)}</p>
          </Stack.Item>
          {m.pending ? <Badge>Pending</Badge> : null}
        </Stack>
      </ResourceList.Item>
    )
  }

  renderMembers = () => {
    const { admins } = this.props
    console.log('renderMembers', admins)
    return (
      <ResourceList
        items={_.values(admins)}
        renderItem={this.renderMember}
      />
    )
  }

  openInviteModal = () => {
    this.setState({ inviteModalVisible: true })
  }

  hideInviteModal = () => {
    this.setState({
      inviteModalVisible: false,
      inviteEmail: null,
      inviteRole: roles.EMPLOYEE
    })
  }

  sendInvitation = () => {
    const { dispatch, admins } = this.props
    const { inviteEmail, inviteRole } = this.state
    const admin = _.find(_.values(admins), (v) => v.email === inviteEmail)
    if (admin && !_.get(admin, 'pending')) {
      this.setState({ inviteError: 'User with such email is already in your team' })
    } else {
      console.log('sendInvitation', inviteEmail, inviteRole)
      // TODO: check the email in current admins
      dispatch(sendInvite(inviteEmail, inviteRole))
      this.hideInviteModal()
    }
  }

  openSelectRoleModal = () => {
    this.setState({ selectRoleModalVisible: true })
  }

  hideSelectRoleModal = () => {
    this.setState({
      selectRoleModalVisible: false
    })
  }

  changeRole = async () => {
    const { memberId, inviteRole } = this.state
    console.log('changeRole', memberId, inviteRole)
    await changeRole(memberId, inviteRole)
    this.hideSelectRoleModal()
  }

  openConfirmationModal = () => {
    this.setState({ confirmationModalVisible: true })
  }

  hideConfirmationModal = () => {
    this.setState({ confirmationModalVisible: false })
  }

  deleteMember = async () => {
    const { memberId } = this.state
    await deleteMember(memberId)
    this.hideConfirmationModal()
  }

  renderInviteModal = () => {
    const { inviteModalVisible, inviteEmail, inviteError } = this.state
    return (
      <Modal
        open={inviteModalVisible}
        onClose={this.hideInviteModal}
        title={'Invite member'}
        primaryAction={{ content: 'Invite', onAction: this.sendInvitation }}
        secondaryActions={[{ content: 'Cancel', onAction: this.hideInviteModal }]}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label='Email'
              type='email'
              value={inviteEmail}
              onChange={this.handleChange('inviteEmail')}
              error={inviteError}
            />
            {this.renderRoleSelect()}
          </FormLayout>
        </Modal.Section>
      </Modal>
    )
  }

  renderSelectRoleModal = () => {
    const { selectRoleModalVisible } = this.state
    return (
      <Modal
        open={selectRoleModalVisible}
        onClose={this.hideSelectRoleModal}
        title={'Change member\'s role'}
        primaryAction={{ content: 'Confirm', onAction: this.changeRole }}
        secondaryActions={[{ content: 'Cancel', onAction: this.hideSelectRoleModal }]}
      >
        <Modal.Section>
          <FormLayout>
            {this.renderRoleSelect()}
          </FormLayout>
        </Modal.Section>
      </Modal>
    )
  }

  renderConfirmationModal = () => {
    const { confirmationModalVisible } = this.state
    return (
      <Modal
        open={confirmationModalVisible}
        onClose={this.hideConfirmationModal}
        title={'Delete member'}
        primaryAction={{ content: 'Confirm', onAction: this.deleteMember }}
        secondaryActions={[{ content: 'Cancel', onAction: this.hideConfirmationModal }]}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Are you sure you want delete this member from your team?
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    )
  }

  gotoSettings = () => {
    history.push('/settings')
  }

  render () {
    const primaryAction = this.isOwner() ? { content: 'Invite member', onAction: this.openInviteModal } : null
    return (
      <PageLayout>
        <Page
          title='Users and roles'
          separator
          primaryAction={primaryAction}
          breadcrumbs={[{ content: 'Settings', onAction: this.gotoSettings }]}>
          <Card>
            {this.renderMembers()}
            {this.renderInviteModal()}
            {this.renderSelectRoleModal()}
            {this.renderConfirmationModal()}
          </Card>
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  references: state.references,
  admins: _.get(state, 'account.admins', {})
})

export default connect(mapStateToProps)(InviteUser)
