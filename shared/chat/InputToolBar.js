import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  ViewPropTypes
} from 'react-native'

import { Send, Composer } from 'react-native-gifted-chat'
import { LIGHT_NAVY_GREY, WHITE, WHITE_GREY } from 'shared/constants/colors'
import styled from 'styled-components'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'

const Container = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  border-top-width: ${props => getWidth(1, props.viewport)};
  border-color: ${LIGHT_NAVY_GREY};
  background-color: ${WHITE};
  padding-bottom: ${props => getWidth(10, props.viewport)};
  bottom: 0;
  left: 0;
  right: 0;
`

const PrimaryView = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
const InputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-width: 1; 
  border-color: ${LIGHT_NAVY_GREY}; 
  border-radius: ${props => getWidth(30, props.viewport)};
  padding-left: ${props => getWidth(10, props.viewport)};
  background-color: ${WHITE_GREY}
`

const SpacingView= styled.View`
  width: 100%;
  height: ${props => getHeight(5, props.viewport)};
  background-color: ${LIGHT_NAVY_GREY}; 
`

// const styles = StyleSheet.create({
//   container: {
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: LIGHT_NAVY_GREY,
//     backgroundColor: WHITE,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   primary: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//   },
//   accessory: {
//     height: 44,
//   }
// })


export default class InputToolbar extends React.Component {

  renderActionsLeft() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderActionsLeft) {
      return this.props.renderActionsLeft(props)
    } 
    return null
  }

  renderActionsRight() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderActionsRight) {
      return this.props.renderActionsRight(props)
    } 
    return null
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props)
    }
    return <Send {...this.props} />
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props)
    }

    return <Composer {...this.props} />
  }

  renderAccessory = () => {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      )
    }
    return null
  }

  render() {
    const { viewport } = this.props
    return (
      <Container viewport={viewport}>
        <PrimaryView viewport={viewport}>
            {this.renderActionsLeft()}
          <InputWrapper viewport={viewport}>
            {this.renderComposer()}
            {this.renderSend()}
          </InputWrapper>
            {this.renderActionsRight()}
        </PrimaryView>
        {this.renderAccessory()}
      </Container>
    )
  }

  // render() {
  //   return (
  //     <View
  //       style={
  //           [
  //             styles.container,
  //             this.props.containerStyle,
              
  //           ]
  //         }
  //       >
  //         <View style={[styles.primary, this.props.primaryStyle]}>
  //           {this.renderActionsLeft()}
  //           {this.renderComposer()}
  //           {this.renderSend()}
  //           {this.renderActionsRight()}
  //         </View>
  //         {this.renderAccessory()}
  //       </View>
  //     )
  // }
}

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {},
}

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style
}