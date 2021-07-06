import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import RNSlidingUpPanel from 'rn-sliding-up-panel'
import ElevatedView from 'react-native-elevated-view'
import Ionicons from '@expo/vector-icons/Ionicons'

import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'

import { BLACK10, WHITE, DUSK } from 'constants/colors'

const Wrapper = styled(ElevatedView)`
  flex: 1;
  overflow: visible;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-width: 1px;
  border-color: #D6D8DD;
  align-items: center;
  background-color: white;
`
const TitleContainer = styled.View`
  width: 100%;
  margin-top: ${props => getHeight(props.showCross ? 30 : 10, props.viewport)};
  height: ${props => getHeight(60, props.viewport)};
  align-items: center;
  justify-content: center;
  /* border-bottom-width: 1;
  border-color: ${BLACK10}; */
`

const CloseIconContainer = styled(TouchableOpacity)`
  position: absolute;
  right: ${props => getWidth(16, props.viewport)};
  top: ${props => getWidth(16, props.viewport)};
  padding-left: ${props => getWidth(6, props.viewport)};
  padding-right: ${props => getWidth(6, props.viewport)};
`
const ContentContainer = styled.View`
  width: 100%;
  background-color: ${WHITE};
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  flex: 1;
`

class SlidingUpPanel extends Component {
  render () {
    const { getRef, draggableRange, paddingBottom, viewport, children, height, onClose, title, showCross, ...rest } = this.props
    return (
      <RNSlidingUpPanel
        allowMomentum
        allowDragging={false}
        onRequestClose={onClose}
        draggableRange={{
          top: height || viewport.height / 2,
          bottom: 100
        }}
        height={height || viewport.height / 2}
        backdropOpacity={0.5}
        {...rest}
      >
        <Wrapper elevation={8} viewport={viewport}>
          {title && (
            <TitleContainer viewport={viewport} showCross={showCross}>
              <StyledText fontSize={18} color={DUSK} black>{title}</StyledText>
            </TitleContainer>
          )}
          <ContentContainer paddingBottom={paddingBottom || 20}>
            {children}
          </ContentContainer>
          {showCross && (
            <CloseIconContainer
              activeOpacity={0.75}
              onPress={onClose}
              viewport={viewport}
            >
              <Ionicons name='md-close' viewport={viewport} size={getWidth(24, viewport)} />
            </CloseIconContainer>
          )}
        </Wrapper>
      </RNSlidingUpPanel>
    )
  }
}

SlidingUpPanel.defaultProps = {
  showCross: true
}

SlidingUpPanel.propTypes = {
  showCross: PropTypes.bool,
  draggableRange: PropTypes.object,
  title: PropTypes.string
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SlidingUpPanel)
