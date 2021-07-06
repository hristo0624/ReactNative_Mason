import React, { Component } from 'react'
import { connect } from 'react-redux'
import emailValidator from 'email-validator'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import TextWithChevron from 'shared/components/sections/TextWithChevron'
import { sendInvite } from 'controllers/auth'
import navigationService from 'shared/navigation/service'
import SelectRole from 'components/panels/SelectRole'
import { getRolesTitles } from 'model/selectors/rolesSelectors'

class InviteUser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      roleId: 'owner',
      panelVisible: false
    }
  }

  handleChangeEmail = (v) => this.setState({ email: v, emailError: false })

  validateEmail = () => {
    const { email } = this.state
    const isValid = emailValidator.validate(email)
    if (!isValid) {
      this.setState({
        emailError: true
      })
    }
  }

  renderEmailInput = () => {
    const { email } = this.state
    return (
      <SectionItemInput
        value={email}
        placeholder={'email'}
        onChange={this.handleChangeEmail}
      />
    )
  }

  sections = () => {
    const { rolesTitles } = this.props
    const { emailError, roleId } = this.state
    return [
      {
        data: [
          {
            title: 'Email',
            key: 'email',
            actionField: this.renderEmailInput(),
            error: emailError ? 'Enter a valid email' : undefined
          },
          {
            title: 'Role',
            key: 'role',
            actionField: <TextWithChevron value={_.get(rolesTitles, roleId)} />,
            onPress: this.togglePanel
          }
        ]
      }
    ]
  }

  sendInvite = () => {
    const { email, roleId } = this.state
    const { dispatch } = this.props
    const isValid = emailValidator.validate(email)
    if (!isValid) {
      this.setState({
        emailError: true
      })
    } else {
      console.log('send invite')
      dispatch(sendInvite(email, roleId))
      navigationService.goBack()
    }
  }

  selectRole = (r) => this.setState({ roleId: r })

  togglePanel = () => this.setState({ panelVisible: !this.state.panelVisible })

  render () {
    const { roleId, panelVisible } = this.state
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: 'Invite user' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Send',
            handler: this.sendInvite
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        <SelectRole
          value={roleId}
          visible={panelVisible}
          onSelect={this.selectRole}
          onClose={this.togglePanel}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  rolesTitles: getRolesTitles(state)
})

export default connect(mapStateToProps)(InviteUser)
