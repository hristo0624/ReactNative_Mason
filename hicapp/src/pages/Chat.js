import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import { PALE_GREY, WHITE, AQUA_MARINE, BROWN_GREY, LIGHT_NAVY } from 'shared/constants/colors'
import { NAV_BAR_HEIGHT, ACTIVE_OPACITY, TYPING_DELAY } from 'constants/index'
import PlusButton from 'shared/components/navbar/PlusButton'
import { StyledText } from 'shared/components/StyledComponents'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'
import { fetchChat, sendMessage, updatedDeliveryStatusRead, startTyping, setReadByTime } from 'controllers/chat'
import {
  initialsByName,
  initialsByFirstLastName,
  cutString,
  firstNameByName,
  typingStringByNames
} from 'shared/utils/stringUtils'
import Avatar from 'shared/components/Avatar'
import TimerTrigger from 'shared/components/TimerTrigger'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import ChatComponent from 'shared/chat/ChatComponent'
import { isIos, majorVersionIOS } from 'constants/index'

const hasStatusBar = isIos && majorVersionIOS >= 11

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: ${props => fontSize(NAV_BAR_HEIGHT, props.viewport)};
`
const AvatarsContainer = styled(View)`
  flex-direction: row;
`

const SpacingView = styled.View`
  height: ${props => getHeight(6, props.viewport)}; 
`

@withMappedNavigationParams()
class Chat extends Component {
  constructor (props) {
    super(props)
    // console.log('CHAT constructor props', props)
    props.dispatch(fetchChat(props.projectId, props.subId))
    const wo = _.get(props.workOrders, props.workOrderId)
    const member = _.get(wo, ['members', props.subId])
    const subName = `${_.get(member, 'firstName', '')} ${_.get(member, 'lastName', '')}`
    this.state = {
      messages: [],
      name: subName
    }
    this.updateTypingTrottled = _.throttle(this.updateTyping, 3000)
  }

  static getDerivedStateFromProps (props, state) {
    if (props.messages !== state.prevMessages) {
      // console.log('GDSFP map messages')
      props.dispatch(setReadByTime(props.projectId, props.subId))
      const messagesRaw = _.get(props.messages, [props.projectId, props.subId], {})
      updatedDeliveryStatusRead(messagesRaw, props.projectId, props.subId)
      const messages = _.map(messagesRaw, m => {
        let hicUser = _.get(props.account, ['admins', m.userId], {})
        let subUser = _.get(props.account, ['contacts', m.userId], {})
        let senderName = ''
        if (_.values(hicUser).length > 0) {
          senderName = _.get(hicUser, 'name', (_.get(hicUser, 'email', '')))
        } else if (_.values(subUser).length > 0) {
          senderName = `${_.get(subUser, 'firstName', '')} ${_.get(subUser, 'lastName', '')}`
        }
        return ({
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          timestamp: m.timestamp,
          status: m.status,
          user: {
            _id: m.userId,
            name: senderName,
            avatar: 'https://placeimg.com/140/140/any'
          }
        })
      })
      const sortedMessages = _.orderBy(messages, ['timestamp'], ['desc'])
      return {
        messages: sortedMessages,
        prevMessages: props.messages
      }
    } else {
      return null
    }
  }

  onPlusClick = () => console.log('on PLus click')
  onTitlePress = () => {
    const { workOrderId } = this.props
    navigationService.push(screens.WORK_ORDER_INFO, { workOrderId })
  }

  renderChatAvatars = () => {
    const { viewport, workOrders, workOrderId, project, user, subId, account } = this.props
    const wo = _.get(workOrders, workOrderId)
    const admins = _.get(project, 'admins', {})
    const avatars = []
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }
    // subcontractor
    avatars.push(
      <Avatar
        key={subId}
        {...avatarProps}
        url={_.get(wo, ['members', subId, 'avatarUrl'])}
        initials={initialsByFirstLastName(_.get(wo, ['members', subId, 'firstName']), _.get(wo, ['members', subId, 'lastName']))}
      />
    )
    // me
    avatars.push(
      <Avatar
        key={user.id}
        {...avatarProps}
        url={_.get(user, ['profile', 'avatarUrl'])}
        initials={initialsByName(_.get(user, 'profile.name'))}
      />
    )
    // other admins
    for (const uid in admins) {
      if (uid !== user.id) {
        avatars.push(
          <Avatar
            key={uid}
            {...avatarProps}
            url={_.get(account, ['admins', uid, 'avatarUrl'])}
            initials={initialsByName(_.get(account, ['admins', uid, 'name']))}
          />
        )
      }
    }
    return avatars
  }

  renderTitle = () => {
    const { viewport, workOrders, workOrderId, typing, projectId, subId, user, account } = this.props
    const wo = _.get(workOrders, workOrderId)
    const { name } = this.state
    const avatars = this.renderChatAvatars()
    const chatMembersAmount = avatars.length
    const titleStr = cutString(`${name} - ${_.get(wo, 'label')}`, 30)

    const projectTyping = _.get(typing, [projectId, subId], {})
    let typingTime = 0
    const typingNames = []
    const timeNow = _.now()
    for (const uid in projectTyping) {
      if (uid !== user.id) {
        const t = projectTyping[uid]
        if (t > typingTime) {
          typingTime = t
        }
        if (t + TYPING_DELAY > timeNow) {
          if (uid === subId) {
            typingNames.push(_.get(wo, ['members', subId, 'firstName']))
          } else {
            typingNames.push(firstNameByName(_.get(account, ['admins', uid, 'name'])))
          }
        }
      }
    }
    return (
      <TitleContainer viewport={viewport}>
        <BackButton />
        <TouchableOpacity
          activeOpacity={ACTIVE_OPACITY}
          onPress={this.onTitlePress}
        >
          <StyledText
            fontSize={18}
            color={LIGHT_NAVY}
          >
            {titleStr}
          </StyledText>
          <TimerTrigger
            timestamp={typingTime}
            componentActive={
              <StyledText
                fontSize={9}
                color={BROWN_GREY}
                customStyle={`opacity: 0.58`}
              >
                {typingStringByNames(typingNames)}
              </StyledText>
            }
            componentInactive={
              <AvatarsContainer>
                {avatars}
                <StyledText
                  fontSize={9}
                  color={BROWN_GREY}
                  customStyle={`opacity: 0.58`}
                >
                  {`${chatMembersAmount} people`}
                </StyledText>
              </AvatarsContainer>
            }
          />
        </TouchableOpacity>
      </TitleContainer>
    )
  }

  onSend = msgs => {
    console.log('on send msgs', msgs)
    const { dispatch, projectId, subId } = this.props
    for (const msg of msgs) {
      dispatch(sendMessage(msg, projectId, subId))
    }
  }

  updateTyping = (text) => {
    if (text !== '') {
      const { projectId, dispatch, subId } = this.props
      dispatch(startTyping(projectId, subId))
    }
  }

  renderMessages = () => {
    // const { messages } = this.props
    const { user, projectId, subId, viewport, readBy } = this.props
    const { messages } = this.state
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }

    const avatars = this.renderChatAvatars()

    let actionLeft = [
      {
        icon: 'Add',
        onPress: null
      }
    ]

    let actionRight = [
      {
        icon: 'Camera',
        onPress: null
      },
      {
        icon: 'Image',
        onPress: null
      }
    ]

    // console.log('render messages', this.props.messages)
    return (
      <ChatComponent
        viewport={viewport}
        user={user}
        projectId={projectId}
        subId={subId}
        messages={messages}
        avatars={avatars}
        avatarProps={avatarProps}
        readBy={readBy}
        onSend={this.onSend}
        onInputTextChanged={this.updateTypingTrottled}
        actionLeft={actionLeft}
        actionRight={actionRight}
      />
    )
  }

  render () {
    const { viewport } = this.props
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          // title={this.renderTitle()}
          leftButton={this.renderTitle()}
          // leftButton={<BackButton />}
          rightButton={<PlusButton color={AQUA_MARINE} onPress={this.onPlusClick} />}
        />
        {this.renderMessages()}
        <SpacingView viewport={viewport} /> 
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : null} /> 
        
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  user: state.user,
  messages: state.messages,
  workOrders: state.workOrders,
  project: state.project,
  typing: state.typing,
  account: state.account,
  readBy: state.readBy
})

export default connect(mapStateToProps)(Chat)
