import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { GiftedChat } from 'react-native-gifted-chat'
import generate from 'firebase-auto-ids'
import { fetchChat, sendMessage, updatedDeliveryStatusRead, startTyping, setReadByTime } from 'controllers/chat'
import Message from 'shared/chat/Message'
import MessageText from 'shared/chat/MessageText'
import Bubble from 'shared/chat/Bubble'
import Avatar from 'shared/components/Avatar'
import { AQUA_MARINE } from 'shared/constants/colors'
import { fontSize, getWidth } from 'shared/utils/dynamicSize'
import {
  initialsByName
} from 'shared/utils/stringUtils'
import ChatComponent from 'shared/chat/ChatComponent'

class PrivateChatPanel extends Component {
  constructor (props) {
    super(props)
    props.dispatch(fetchChat(props.project.id))
    this.state = {
      privmessages: []
    }
    this.updateTypingTrottled = _.throttle(this.updateTyping, 3000)
  }

  componentWillUnmount = () => {

  }

  static getDerivedStateFromProps (props, state) {
    if (props.messages !== state.prevMessages) {
      props.dispatch(setReadByTime(props.project.id))
      const messagesRaw = _.get(props.messages, [props.project.id, 'private'], {})
      updatedDeliveryStatusRead(messagesRaw, props.project.id)
      const messages = _.map(messagesRaw, m => {
        let hicUser = _.get(props.account, ['admins', m.userId], {})
        let senderName = ''
        if (_.values(hicUser).length > 0) {
          senderName = _.get(hicUser, 'name', (_.get(hicUser, 'email', '')))
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

  renderChatAvatars = () => {
    const { viewport, project, user, account } = this.props
    const admins = _.get(project, 'admins', {})
    const avatars = []
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }
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

  onSend = msgs => {
    console.log('on send msgs', msgs)
    const { dispatch, project } = this.props
    const projectId = project.id
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

  renderBubble = (t) => {
    const { viewport } = this.props
    return (
      <Bubble
        {...t}
        viewport={viewport}
        subsApp
      />
    )
  }

  renderMessage = (t) => {
    const { viewport } = this.props
    const readBy = _.get(this.props.readBy, [this.props.project.id, 'private'], {})
    const avatars = this.renderChatAvatars()
    let newAvatars = []
    for (let aid in avatars) {
      for (let uid in readBy) {
        if (t.nextMessage.timestamp !== undefined) {
          if (uid !== this.props.user.id &&
            uid === avatars[aid].key &&
            readBy[uid] >= t.currentMessage.timestamp &&
            readBy[uid] < t.nextMessage.timestamp) {
            newAvatars.push(avatars[aid])
          }
        } else {
          if (uid !== this.props.user.id &&
            uid === avatars[aid].key &&
            readBy[uid] >= t.currentMessage.timestamp) {
            newAvatars.push(avatars[aid])
          }
        }
      }
    }

    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }

    let senderAvatar = (
      <Avatar
        key={t.currentMessage.user._id}
        {...avatarProps}
        url={t.currentMessage.user.avatar}
        initials={initialsByName(t.currentMessage.user.name)}
      />
    )

    return (
      <Message
        {...t}
        viewport={this.props.viewport}
        renderBubble={this.renderBubble}
        avatars={newAvatars}
        senderAvatar={senderAvatar}
      />
    )
  }

  updateTyping = (text) => {
    if (text !== '') {
      const { project, dispatch } = this.props
      let projectId = project.id
      dispatch(startTyping(projectId))
    }
  }

  render () {
    const { user, project, viewport } = this.props
    const { messages } = this.state
    let projectId = project.id

    const readBy = _.get(this.props.readBy, [this.props.project.id, 'private'], {})
    const avatarProps = {
      color: AQUA_MARINE,
      size: fontSize(12, viewport),
      customStyle: `margin-right: ${getWidth(2, viewport)}`
    }

    const avatars = this.renderChatAvatars()

    let actionLeft = [
      
    ]

    let actionRight = [
      
    ]

    // console.log('render messages', this.props.messages)
    return (
      <ChatComponent
        viewport={viewport}
        user={user}
        projectId={projectId}
        subId={'private'}
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

  /* render () {
    const { user, project } = this.props
    const { messages } = this.state
    let projectId = project.id

    return (
      <GiftedChat
        renderAvatarOnTop
        key={projectId}
        messageIdGenerator={() => generate(_.now())}
        messages={messages}
        onSend={this.onSend}
        renderMessage={this.renderMessage}
        renderMessageText={this.renderMessageText}
        onInputTextChanged={this.updateTypingTrottled}
        user={{
          _id: user.id
        }}
      />
    )
  } */
}

PrivateChatPanel.defaultProps = {
  visible: false,
  onClose: () => null
}

PrivateChatPanel.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user,
  messages: state.messages,
  workOrders: state.workOrders,
  project: state.project,
  typing: state.typing,
  account: state.account,
  readBy: state.readBy
})

export default connect(mapStateToProps)(PrivateChatPanel)
