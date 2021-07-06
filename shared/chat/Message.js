/* eslint-disable no-underscore-dangle, no-use-before-define */

import PropTypes from 'prop-types'
import React from 'react'
import { View, ViewPropTypes} from 'react-native'
import styled from 'styled-components'

import { utils } from 'react-native-gifted-chat'
import Bubble from 'shared/chat/Bubble'
import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import Day from 'shared/chat/Day'
import { StyledText } from 'shared/components/StyledComponents'
import { BROWN_GREY } from 'shared/constants/colors'

const { isSameUser, isSameDay } = utils

const Container = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  margin-horizontal: ${props => getWidth(10, props.viewport)};
  margin-bottom: ${props => getHeight(props.marginBottom, props.viewport)};
`

const AvatarsContainer = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-right: ${props => getWidth(20, props.viewport)};
  margin-bottom: ${props => getHeight(10, props.viewport)};
`

export default class Message extends React.Component {

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props
    return {
      ...props,
      // position: 'left',
      isSameUser,
      isSameDay
    }
  }

  renderDay () {
    const { viewport } = this.props
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps)
      }
      return <Day {...dayProps} viewport={viewport} />
    }
    return null
  }

  renderBubble() {
    const { viewport, subsApp, senderAvatar } = this.props
    const bubbleProps = this.getInnerComponentProps()
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} viewport={viewport} subsApp={subsApp} senderAvatar={senderAvatar} />
  }

  renderAvatars() {
    const { avatars, viewport } = this.props
    let avatarNum = avatars.length
    let newAvatars = []
    if (avatarNum > 5) {
      for (let i = 0; i < 5; i++) 
        newAvatars.push(avatars[i])
    } else {
      avatars.forEach(avatar => {
        newAvatars.push(avatar);
      });
    }
    if (newAvatars.length > 0) {
      if (avatars.length > 5) {
        return (
          <AvatarsContainer
            viewport={viewport}
          >
            {newAvatars}
            <StyledText
              fontSize={9}
              color={BROWN_GREY}
              customStyle={`opacity: 0.58`}
            >
              {`${avatarNum} people`}
            </StyledText>
          </AvatarsContainer>
        )
      } else {
        return (
          <AvatarsContainer
            viewport={viewport}
          >
            {newAvatars}
          </AvatarsContainer>
        )
      }
      
    }
    return null
  }

  render() {
    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 8 : 16
    const { viewport } = this.props
    return (
      <View>
        {this.renderDay()}
        <Container viewport={viewport} marginBottom={marginBottom}>          
          {this.renderBubble()}
        </Container>
        {this.renderAvatars()}
      </View>
    )
  }
}

Message.defaultProps = {
  renderBubble: null,
  renderDay: null,
  renderAvatar: null,
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  subsApp: false,
  avatars: [],
  senderAvatar: null
}

Message.propTypes = {
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  renderAvatar: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style
  }),
  subsApp: PropTypes.bool,
  avatars: PropTypes.array,
  senderAvatar: PropTypes.element
}