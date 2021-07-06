import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import generate from 'firebase-auto-ids'
import _ from 'lodash'
import { View } from 'react-native'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import Textarea from 'shared/components/inputs/Textarea'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { StyledText } from 'shared/components/StyledComponents'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import EmailPhoneSelect from 'components/panels/EmailPhoneSelect'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'

const ModalContentWrapper = styled(View)`
  flex: 1;
  background-color: ${PALE_GREY};
`

class SendInvitationPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      emailsPhones: {},
      emailPhoneSelectVisible: false,
      message: ''
    }
  }

  onInvite = () => {
    const { message, emailsPhones } = this.state
    const { contact, onSelect, onClose } = this.props
    onSelect({
      ...contact,
      message,
      emailsPhones
    })
    onClose()
  }

  renderInviteButton = () => {
    const { viewport } = this.props
    return (
      <PrimaryButton
        color={AQUA_MARINE}
        customStyle={`
          height: ${getHeight(44, viewport)};
          width: ${getWidth(240, viewport)};
          margin-top: ${getHeight(50, viewport)};
          margin-bottom: ${getHeight(20, viewport)};
          align-self: center;
        `}
        title='Invite'
        onPress={this.onInvite}
      />
    )
  }

  onChangeEmailPhone = id => v => {
    const { emailsPhones } = this.state
    this.setState({
      emailsPhones: {
        ...emailsPhones,
        [id]: {
          ...emailsPhones[id],
          value: v
        }
      }
    })
  }

  renderCustomEmailsPhones = () => {
    const { emailsPhones } = this.state
    return _.map(emailsPhones, (ep, id) => ({
      title: ep.type === 'email' ? 'Email' : 'Phone number',
      key: id,
      actionField: (
        <SectionItemInput
          value={ep.value}
          onChange={this.onChangeEmailPhone(id)}
          placeholder={ep.type === 'email' ? 'email' : '#'}
          keyboardType={ep.type === 'email' ? 'email-address' : 'phone-pad'}
        />
      )
    }))
  }

  toggleEmailPhoneSelect = () => this.setState({ emailPhoneSelectVisible: !this.state.emailPhoneSelectVisible })

  renderEmailPhoneSelect = () => {
    const { emailPhoneSelectVisible } = this.state
    return (
      <EmailPhoneSelect
        visible={emailPhoneSelectVisible}
        onClose={this.toggleEmailPhoneSelect}
        onSelect={this.addEmailOrPhone}
        value={'email'}
      />
    )
  }

  addEmailOrPhone = (type) => {
    const { emailsPhones } = this.state
    const id = generate(_.now())
    this.setState({
      emailsPhones: {
        ...emailsPhones,
        [id]: {
          type: type,
          value: ''
        }
      }
    })
  }

  onChangeMessage = m => this.setState({ message: m })

  sections = () => {
    const { message } = this.state
    const { contact, project } = this.props
    return [
      {
        title: 'DELIVER TO',
        data: [
          {
            title: 'Phone number',
            key: 'phone',
            actionField: (
              <StyledText>{_.get(contact, 'phone', '')}</StyledText>
            ),
            notClickable: true
          },
          ...this.renderCustomEmailsPhones(),
          {
            title: 'Add phone',
            addNewField: true,
            // onPress: this.toggleEmailPhoneSelect,
            onPress: () => this.addEmailOrPhone('phone'),
            key: 'add'
          }
        ]
      },
      {
        title: 'Message body',
        data: [
          {
            key: 'message',
            customContent: (
              <Textarea
                value={message}
                onChangeText={this.onChangeMessage}
                maxLength={140}
                customStyle='padding-horizontal: 0'
                placeholder={`Hi ${_.get(contact, 'firstName', '')}, I would like to invite you to bid on a project in ${_.get(project, 'address.city', 'Rancho Cucamonga')}.  I would need you to start in the next 5 days.`}
              />
            )
          }
        ]
      },
      {
        customHeader: this.renderInviteButton(),
        noBorder: true,
        data: []
      }
    ]
  }

  renderTitle = () => {
    const { contact } = this.props
    return (
      <TitleWithDesc
        title='Send invitation'
        desc={`${_.get(contact, 'firstName', '')} ${_.get(contact, 'lastName', '')}`}
      />
    )
  }

  render () {
    const { viewport, visible, onClose } = this.props
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        percHeight={0.75}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={this.renderTitle()}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList
            sections={this.sections()}
          />
        </ModalContentWrapper>
        {this.renderEmailPhoneSelect()}
      </SlidingUpModal>
    )
  }
}

SendInvitationPanel.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

SendInvitationPanel.propTypes = {
  contact: PropTypes.object,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  project: state.project
})

export default connect(mapStateToProps)(SendInvitationPanel)
