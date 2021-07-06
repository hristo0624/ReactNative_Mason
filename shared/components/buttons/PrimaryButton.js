import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import { WHITE, LIGHT_NAVY, BLACK20 } from 'shared/constants/colors'

const TouchableWrapper = styled.TouchableOpacity`
  background-color: ${props => props.color || LIGHT_NAVY};
  align-items: center;
  justify-content: center;
  height: ${props => getHeight(50, props.viewport)};
  border-radius: 4;
  ${props => props.customStyle || ''}
`
const Spinner = styled.ActivityIndicator`
  margin-left: ${props => getWidth(10, props.viewport)};
`
const TextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const PrimaryButton = ({ viewport, onPress, onDisabledPress, title, loading, textColor, color, colorDisabled, disabled, textCustomStyle, textProps, ...rest }) => {
  let handlePress = onPress
  if (loading) handlePress = () => null
  if (disabled) handlePress = onDisabledPress
  return (
    <TouchableWrapper
      {...rest}
      color={disabled ? colorDisabled : color}
      viewport={viewport}
      onPress={handlePress}
      activeOpacity={disabled ? 1 : 0.6}
    >
      <TextWrapper>
        <StyledText
          color={textColor}
          fontSize={16}
          {...textProps}
          customStyle={textCustomStyle}
        >
          {title}
        </StyledText>
        { loading ? <Spinner color={WHITE} viewport={viewport} /> : null }
      </TextWrapper>
    </TouchableWrapper>
  )
}

PrimaryButton.defaultProps = {
  onPress: () => null,
  loading: false,
  color: LIGHT_NAVY,
  colorDisabled: BLACK20,
  textColor: WHITE,
  disabled: false,
  textProps: {}
}

PrimaryButton.propTypes = {
  viewport: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  customStyle: PropTypes.string,
  textColor: PropTypes.string,
  color: PropTypes.string,
  colorDisabled: PropTypes.string,
  disabled: PropTypes.bool,
  textCustomStyle: PropTypes.string,
  textProps: PropTypes.object
}

export default connect(state => ({ viewport: state.viewport }))(PrimaryButton)
