import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth, fontSize as getFontSize } from 'shared/utils/dynamicSize'
import { LIGHT_NAVY } from 'shared/constants/colors'

const TouchableWrapper = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: ${props => getHeight(50, props.viewport)};
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

const PlainButton = ({ viewport, onPress, title, color, fontSize, loading, prefix, postfix, ...rest }) => (
  <TouchableWrapper
    {...rest}
    viewport={viewport}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <TextWrapper>
      { prefix }
      <StyledText
        color={color || LIGHT_NAVY}
        fontSize={fontSize || 18}
        // letterSpacing={1}
        customStyle={`
          margin-left: ${ prefix ? getFontSize(10, viewport) : 0};
          margin-right: ${ postfix ? getFontSize(10, viewport) : 0}`
        }
      >
        {title}
      </StyledText>
      { loading ? <Spinner color={color || LIGHT_NAVY} viewport={viewport} /> : null }
      { postfix }
    </TextWrapper>
  </TouchableWrapper>
)

PlainButton.defaultProps = {
  onPress: () => null,
  loading: false
}

PlainButton.propTypes = {
  viewport: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  loading: PropTypes.bool,
  customStyle: PropTypes.string,
  fontSize: PropTypes.number
}

export default connect(state => ({ viewport: state.viewport }))(PlainButton)
