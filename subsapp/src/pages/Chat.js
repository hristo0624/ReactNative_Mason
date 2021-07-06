import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { View, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { GiftedChat } from 'react-native-gifted-chat'
import generate from 'firebase-auto-ids'

import MessageText from 'shared/chat/MessageText'
import Message from 'shared/chat/Message'
import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import { PALE_GREY, WHITE, AQUA_MARINE, LIGHT_NAVY, BROWN_GREY } from 'shared/constants/colors'
import { NAV_BAR_HEIGHT, TYPING_DELAY, ACTIVE_OPACITY } from 'constants/index'
import { StyledText } from 'shared/components/StyledComponents'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'
import { fetchChat, sendMessage, updatedDeliveryStatusRead, startTyping, fetchProfile, fetchWorkOrders, fetchChatUserProfiles } from 'controllers/chat'
import TimeWithStatus from 'shared/chat/TimeWithStatus'
import TimerTrigger from 'shared/components/TimerTrigger'
import { typingStringByNames } from 'shared/utils/stringUtils'
import MarketingIcon from 'shared/icons/Marketing'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import SelectWorkOrderPanel from 'pages/chat/SelectWorkOrderPanel'
import Avatar from 'shared/components/Avatar'
import {
  initialsByName
} from 'shared/utils/stringUtils'
import ChatComponent from 'shared/chat/ChatComponent'

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: ${props => fontSize(NAV_BAR_HEIGHT, props.viewport)};
`

const SpacingView = styled.View`
  height: ${props => getHeight(6, props.viewport)}; 
`

@withMappedNavigationParams()
class Chat extends Component {
  constructor (props) {
    super(props)
    // console.log('CHAT constructor props', props)
    props.dispatch(fetchChat(props.projectId))
    // props.dispatch(fetchChatUserProfiles(props.projectId))
    this.state = {
      messages: [],
      workOrdersSelectorVisible: false,
    }
    this.updateTypingTrottled = _.throttle(this.updateTyping, 3000)
  }

  static getDerivedStateFromProps (props, state) {
    let newState = null
    console.log("Chat.props=", props.profiles)
    if (props.messages !== state.prevMessages) {
      // console.log('GDSFP map messages')
      const messagesRaw = _.get(props.messages, props.projectId, {})
      updatedDeliveryStatusRead(messagesRaw, props.projectId)
      
      const messages = _.map(messagesRaw, m => {
        const mSender = _.get(props.profiles, m.userId, {})
        let senderName = ''
        senderName = _.get(mSender, 'name', (_.get(mSender, 'email', '')))
        return ({
          _id: m.id,
          text: m.text,
          createdAt: new Date(m.timestamp),
          timestamp: m.timestamp,
          status: m.status,
          user: {
            _id: m.userId,
            name: senderName,
            avatar: _.get(m, 'avatarSmall', 'https://placeimg.com/140/140/any')
          }
        })
      })
      const sortedMessages = _.orderBy(messages, ['timestamp'], ['desc'])
      if (_.isNil(newState)) newState = {}
      _.set(newState, 'messages', sortedMessages)
      _.set(newState, 'prevMessages', props.messages)
    }

    // fetch work orders
    const projectId = _.get(props, 'projectId')
    const workOrdersInfo = _.get(props, ['user', 'projects', projectId, 'workOrders'], {})
    const workOrdersIds = _.keys(workOrdersInfo)
    if (!_.isEqual(workOrdersIds, state.prevWorkOrdersIds)) {
      if (_.isNil(newState)) newState = {}
      _.set(newState, 'prevWorkOrdersIds', workOrdersIds)
      console.log('fetch work orders', workOrdersIds)
      props.dispatch(fetchWorkOrders(workOrdersIds))
    }
    return newState
  }



  renderTitle = () => {
    const { viewport, projectId, user, profiles, dispatch, typing, workOrders } = this.props
    const projectInfo = _.get(user, ['projects', projectId, 'projectInfo'])
    const projectTyping = _.get(typing, projectId, {})
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
          if (uid !== user.id) {
            const name = _.get(profiles, [ uid, 'name'], _.get(profiles, [uid, 'firstName']))
            if (name) {
              typingNames.push(name)
            } else {
              dispatch(fetchProfile(uid))
            }
          }
        }
      }
    }

    return (
      <TitleContainer viewport={viewport}>
        <BackButton />
        <View>
          <StyledText
            fontSize={18}
            color={LIGHT_NAVY}
          >
            {_.get(projectInfo, 'address.name')}
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
              <StyledText
                fontSize={9}
                color={BROWN_GREY}
                customStyle={`opacity: 0.58`}
              >
                {_.get(_.values(workOrders), [0, 'companyName'], 'pending...')}
              </StyledText>
            }
          />
        </View>
      </TitleContainer>
    )
  }

  onSend = msgs => {
    console.log('on send msgs', msgs)
    const { dispatch, projectId } = this.props
    for (const msg of msgs) {
      dispatch(sendMessage(msg, projectId))
    }
  }

  renderMessageText = t => {
    // console.log('render text t', t)
    const { viewport } = this.props
    return (
      <MessageText
        viewport={viewport}
        {...t}
      />
    )
  }

  renderTime = (t) => {
    const { viewport } = this.props
    return (
      <TimeWithStatus
        t={t}
        viewport={viewport}
      />
    )
  }

  renderMessage = (t) => {
    return (
      <Message {...t} viewport={this.props.viewport} subsApp />
    )
  }

  updateTyping = (text) => {
    if (text !== '') {
      const { projectId, dispatch, subId } = this.props
      dispatch(startTyping(projectId, subId))
    }
  }

  /* renderMessages = () => {
    const { user, projectId, readBy, dispatch } = this.props
    const { messages } = this.state

    const readByObject = _.get(readBy, projectId, {})
    // console.log("Chat.readBy=", readByObject)
    for (const userId in readByObject) {
      dispatch(fetchProfile(userId))
    }
    console.log("this.state=", this.props.profiles)
    let avatars = []
    return (
      <GiftedChat
        key={projectId}
        messageIdGenerator={() => generate(_.now())}
        messages={messages}
        onSend={this.onSend}
        renderMessageText={this.renderMessageText}
        renderMessage={this.renderMessage}
        user={{ _id: user.id }}
        onInputTextChanged={this.updateTypingTrottled}
      />
    )
  } */

  renderChatAvatars = () => {
    const { profiles, viewport } = this.props
    let avatars = []
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }
    for (const userId in profiles) {
      const profile = profiles[userId]
      avatars.push(
        <Avatar
          key={userId}
          {...avatarProps}
          url={_.get(profile, 'avatar', '')}
          initials={initialsByName(_.get(profile, 'name', ''))} //need to be implmented to get username if name field not exist
        />
      )
    }
    return avatars    
  }

  renderMessages = () => {
    // const { messages } = this.props
    const { user, projectId, viewport, readBy, dispatch } = this.props
    console.log("ReadBy=", readBy)
    const { messages } = this.state
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }

    const readByObject = _.get(readBy, [projectId, user.id], {})
    // console.log("Chat.readBy=", readByObject)
    for (const userId in readByObject) {
      dispatch(fetchProfile(userId))
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
        subId={user.id}
        messages={messages}
        avatars={avatars}
        avatarProps={avatarProps}
        readBy={readBy}
        onSend={this.onSend}
        onInputTextChanged={this.updateTypingTrottled}
        actionLeft={actionLeft}
        actionRight={actionRight}
        subsApp={true}
      />
    )
  }

  toggleWorkOrdersSelector = () => this.setState({ workOrdersSelectorVisible: !this.state.workOrdersSelectorVisible })

  onWorkOrderSeleted = (workOrderId) => {
    this.toggleWorkOrdersSelector()
    navigationService.push(screens.VIEW_WORK_ORDER, { workOrderId })
  }

  closeWorkOrderSeletor = () => {
    this.setState({
      workOrder: null,
      workOrdersSelectorVisible: false
    })
  }

  renderWorkOrderSelect = () => {
    const { workOrders } = this.props
    const { workOrdersSelectorVisible } = this.state
    return (
      <SelectWorkOrderPanel
        visible={workOrdersSelectorVisible}
        onClose={this.closeWorkOrderSeletor}
        onSelect={this.onWorkOrderSeleted}
        companyName={_.get(_.values(workOrders), [0, 'companyName'], 'pending...')}
      />
    )
  }

  selectWorkOrderToShow = () => {
    const { workOrders } = this.props
    if (_.size(workOrders) > 1) {
      this.toggleWorkOrdersSelector()
    } else {
      const workOrder = _.get(_.values(workOrders), 0)
      if (workOrder) {
        navigationService.push(screens.VIEW_WORK_ORDER, { workOrderId: workOrder.id })
      }
    }
  }

  renderNavBarRight = () => {
    // TODO: this content depends on the project state and work orders state
    const { viewport } = this.props
    return (
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={this.selectWorkOrderToShow}
      >
        <TitleContainer viewport={viewport} >
          <MarketingIcon color={AQUA_MARINE} size={fontSize(20, viewport)} />
          <StyledText
            color={AQUA_MARINE}
            customStyle={`margin-right: ${getWidth(15, viewport)}; margin-left: ${getWidth(5, viewport)};`}
          >
            View jobs
          </StyledText>
        </TitleContainer>
      </TouchableOpacity>
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
          leftButton={this.renderTitle()}
          rightButton={this.renderNavBarRight()}
        />
        {this.renderWorkOrderSelect()}
        {this.renderMessages()}
        <SpacingView viewport={viewport} /> 
        <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : null} /> 
      </Page>
    )
  }
}

Chat.propTypes = {
  projectId: PropTypes.string
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  user: state.user,
  messages: state.messages,
  workOrders: state.workOrders,
  typing: state.typing,
  profiles: state.profiles,
  readBy: state.readBy
})

export default connect(mapStateToProps)(Chat)
