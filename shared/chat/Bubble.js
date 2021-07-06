import PropTypes from 'prop-types'
import React from 'react'
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
} from 'react-native'
import ElevatedView from 'react-native-elevated-view'
import styled from 'styled-components'
import { MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat'

import { LIGHT_NAVY, BROWN_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'
import BubbleTailRight from 'shared/icons/BubbleTailRight'
import BubbleTailLeft from 'shared/icons/BubbleTailLeft'
import TimeWithStatus from 'shared/chat/TimeWithStatus'
import { StyledText } from 'shared/components/StyledComponents'

const { isSameUser, isSameDay } = utils

const Container = styled(View)`
  flex: 1;
  align-items: ${props => props.isLeft ? 'flex-start' : 'flex-end' };

`
const Wrapper = styled(ElevatedView)`
  background-color: ${props => props.isLeft ? WHITE : (props.subsApp ? AQUA_MARINE : LIGHT_NAVY) };
  border-radius: ${props => fontSize(15, props.viewport)};
  margin-horizontal: ${props => fontSize(10, props.viewport)};
  align-items: flex-start;
  width: ${props => getWidth(260, props.viewport)};
`
const RightTailContainer = styled(View)`
  position: absolute;
  right: ${props => fontSize(-4, props.viewport)};
  bottom: 0;
`
const LeftTailContainer = styled(View)`
  position: absolute;
  left: ${props => fontSize(-22, props.viewport)};
  bottom: ${props => fontSize(-2, props.viewport)};;
`

const AVMSWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
`

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          'Copy Text',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
          }
        });
      }
    }
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return (
        <MessageText
          {...messageTextProps}
          textStyle={{
            left: [styles.standardFont, styles.slackMessageText, messageTextProps.textStyle, messageTextStyle],
          }}
        />
      );
    }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} imageStyle={[styles.slackImage, messageImageProps.imageStyle]} />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderUsername () {
    const { viewport } = this.props
    const username = this.props.currentMessage.user.name;
    if (username) {
      return (
        <StyledText
          fontSize={10}
          color={BROWN_GREY}
          customStyle={`
            margin-left: ${getWidth(20, viewport)};
            margin-bottom: ${getHeight(3, viewport)};
          `}
        >
          {username}
        </StyledText>
      )
    }
    return null
  }

  renderTime() {
    return (
      <TimeWithStatus {...this.props} />
    )
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  renderTail = () => {
    const { viewport, position, subsApp } = this.props
    const isLeft = position === 'left'
    const tailSize = 36
    if (isLeft) {
      return (
        <LeftTailContainer viewport={viewport}>
          <BubbleTailLeft
            size={fontSize(tailSize, viewport)}
            color={WHITE}
          />
        </LeftTailContainer>
      )
    } else {
      return (
        <RightTailContainer viewport={viewport}>
          <BubbleTailRight
            size={fontSize(tailSize, viewport)}
            color={subsApp ? AQUA_MARINE : LIGHT_NAVY}
            // color='yellow'
          />
        </RightTailContainer>
      )
    }
  }

  render() {
    const { viewport, position, subsApp, senderAvatar } = this.props
    const isLeft = position === 'left'
    const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage)
    const messageHeader = isSameThread || !isLeft ? null : (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTicks()}
      </View>
    )
    const avatar = !isLeft ? null : senderAvatar

    return (
      <Container
        isLeft={isLeft}
        viewport={viewport}
      >
        {messageHeader}
        <TouchableOpacity
          // onLongPress={this.onLongPress}
          accessibilityTraits="text"
          disabled
          {...this.props.touchableProps}
        >
          <AVMSWrapper>
            {avatar}
            <Wrapper
              viewport={viewport}
              elevation={1}
              isLeft={isLeft}
              subsApp={subsApp}
            >  
              {this.renderTail()}
              {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageText()}
              {this.renderTime()}
            </Wrapper>
          </AVMSWrapper>
        </TouchableOpacity>
      </Container>
    )
  }

}

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  // standardFont: {
  //   fontSize: 15,
  // },
  // slackMessageText: {
  //   marginLeft: 0,
  //   marginRight: 0,
  // },
  // container: {
  //   flex: 1,
  //   alignItems: 'flex-start',
  // },
  // wrapper: {
  //   marginRight: 60,
  //   minHeight: 20,
  //   justifyContent: 'flex-end',
  // },
  // username: {
  //   fontWeight: 'bold',
  // },
  // time: {
  //   textAlign: 'left',
  //   fontSize: 12,
  // },
  // timeContainer: {
  //   marginLeft: 0,
  //   marginRight: 0,
  //   marginBottom: 0,
  // },
  // headerItem: {
  //   marginRight: 10,
  // },
  // headerView: {
  //   // Try to align it better with the avatar on Android.
  //   marginTop: Platform.OS === 'android' ? -2 : 0,
  //   flexDirection: 'row',
  //   alignItems: 'baseline',
  // },
  // /* eslint-disable react-native/no-color-literals */
  // tick: {
  //   backgroundColor: 'transparent',
  //   color: 'white',
  // },
  // /* eslint-enable react-native/no-color-literals */
  // tickView: {
  //   flexDirection: 'row',
  // },
  // slackImage: {
  //   borderRadius: 3,
  //   marginLeft: 0,
  //   marginRight: 0,
  // },
});

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTime: null,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
  senderAvatar: null
};

Bubble.propTypes = {
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  messageTextStyle: Text.propTypes.style,
  usernameStyle: Text.propTypes.style,
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  senderAvatar: PropTypes.element
};