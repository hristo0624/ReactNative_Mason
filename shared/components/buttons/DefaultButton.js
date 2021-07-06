import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import ElevatedView from 'react-native-elevated-view'

import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import { WHITE, LIGHT_NAVY, AQUA_MARINE } from 'shared/constants/colors'

const StyledElevatedView = styled(ElevatedView)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${props => getHeight(4, props.viewport)};
  height: ${props => getHeight(50, props.viewport)};
  background-color: ${props => props.color};
  ${props => props.customStyle || ''}
`
const TouchableWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
const Spinner = styled.ActivityIndicator`
  margin-left: ${props => getWidth(10, props.viewport)};
`
const TextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${props => getWidth(20, props.viewport)};
`

const DefaultButton = ({ viewport, onPress, title, loading, buttonType, disabled, fontSize, customStyle }) => {
  let buttonStyle
  switch (buttonType) {
    case AQUA_MARINE:
      buttonStyle = {
        backgroundColor: AQUA_MARINE,
        fontColor: WHITE
      }
      break
    default:
      buttonStyle = {
        backgroundColor: WHITE,
        fontColor: LIGHT_NAVY
      }
  }
  return (
    <TouchableWrapper
      viewport={viewport}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.75}
    >
      <StyledElevatedView
        viewport={viewport}
        elevation={2}
        color={buttonStyle.backgroundColor}
        customStyle={customStyle}
      >
        <TextWrapper viewport={viewport}>
          <StyledText
            color={buttonStyle.fontColor}
            fontSize={fontSize || 20}
            letterSpacing={0.05}
          >
            {title}
          </StyledText>
          { loading ? <Spinner color={buttonStyle.fontColor} viewport={viewport} /> : null }
        </TextWrapper>

      </StyledElevatedView>
    </TouchableWrapper>
  )
}

DefaultButton.defaultProps = {
  onPress: () => null,
  loading: false,
  buttonType: WHITE,
  disabled: false
}

DefaultButton.propTypes = {
  viewport: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  title: PropTypes.string,
  loading: PropTypes.bool,
  buttonType: PropTypes.oneOf([ WHITE, AQUA_MARINE ]),
  customStyle: PropTypes.string,
  disabled: PropTypes.bool
}

export default connect(state => ({ viewport: state.viewport }))(DefaultButton)
