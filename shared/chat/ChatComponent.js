/* eslint-disable no-underscore-dangle, no-use-before-define */

import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'

import { GiftedChat } from 'react-native-gifted-chat'
import Bubble from 'shared/chat/Bubble'
import generate from 'firebase-auto-ids'
import Avatar from 'shared/components/Avatar'
import Message from 'shared/chat/Message'
import MessageText from 'shared/chat/MessageText'
import TimeWithStatus from 'shared/chat/TimeWithStatus'
import { initialsByName } from 'shared/utils/stringUtils'
import Actions from 'shared/chat/Actions'
import InputToolBar from 'shared/chat/InputToolBar'

export default class ChatComponent extends React.Component {

  renderMessage = (t) => {
    const { viewport, avatars, avatarProps, subsApp } = this.props
    let readBy = {}
    if (subsApp === false) {
      readBy = _.get(this.props.readBy, [this.props.projectId, this.props.subId], {})
    } else {
      readBy = _.get(this.props.readBy, this.props.projectId, {})
    }
    // const readBy = _.get(this.props.readBy, [this.props.projectId, this.props.subId], {})
    
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
        viewport={viewport}
        avatars={newAvatars}
        senderAvatar={senderAvatar}
        subsApp={subsApp}
      />
    )
  }

  renderMessageText = t => {
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

  renderBubble = (t) => {
    const { viewport } = this.props
    return (
      <Bubble
        {...t}
        viewport={viewport}
      />
    )
  }

  renderActionsLeft = () => {
    const { viewport, actionLeft } = this.props

    return (
      <Actions 
        viewport={viewport}
        actionIcons={actionLeft}
      ></Actions>
    )
  }

  renderActionsRight = () => {
    const { viewport, actionRight } = this.props

    return (
      <Actions 
        viewport={viewport}
        actionIcons={actionRight}
      ></Actions>
    )
  }

  renderInputToolbar = (props) => {
    const { viewport } = this.props
    return (
      <InputToolBar 
        {...props}
        renderActionsLeft={this.renderActionsLeft}
        renderActionsRight={this.renderActionsRight}
        viewport={viewport}
      />      
    )
  }  

  render() {
    const { user, projectId, subId, messages, onSend, onInputTextChanged } = this.props
    return (
      <GiftedChat
        renderAvatarOnTop
        key={projectId + subId}
        messageIdGenerator={() => generate(_.now())}
        messages={messages}
        onSend={onSend}
        renderMessage={this.renderMessage}
        renderMessageText={this.renderMessageText}
        onInputTextChanged={onInputTextChanged}
        renderInputToolbar={this.renderInputToolbar}
        user={{
          _id: user.id
        }}
      />
    )
  }
}

ChatComponent.defaultProps = {
  projectId: '',
  subId: '',
  messageIdGenerator: null,
  messages: [],
  onSend: null,
  renderMessage: null,
  renderMessageText: null,
  onInputTextChanged: null,
  user: {},
  readBy: {},
  avatars: [],
  avatarProps: {},
  subsApp: false
}

ChatComponent.propTypes = {
  projectId: PropTypes.string,
  subId: PropTypes.string,
  messageIdGenerator: PropTypes.func,
  messages: PropTypes.array,
  onSend: PropTypes.func,
  renderMessage: PropTypes.func,
  renderMessageText: PropTypes.func,
  onInputTextChanged: PropTypes.func,
  user: PropTypes.object,
  readBy: PropTypes.object,
  avatars: PropTypes.array,
  avatarProps: PropTypes.object,
  subsApp: PropTypes.bool
}