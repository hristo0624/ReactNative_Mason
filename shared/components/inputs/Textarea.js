import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'
import { View, TextInput } from 'react-native'
import ElevatedView from 'react-native-elevated-view'

import { getHeight, fontSize, getWidth } from 'shared/utils/dynamicSize'
import { BROWN_GREY, WHITE } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'

const StyledElevatedView = styled(ElevatedView)`
  width: 100%;
  flex: 1;
  flex-direction: column;
  background-color: ${WHITE};
`
const StyledTextarea = styled.TextInput`
  width: 100%;
  ${props => props.customStyle || ''};
`

const Textarea = ({ viewport, maxLength, value, autoFocus, height, customStyle, ...props }) => (
  <StyledElevatedView
    viewport={viewport}
    elevation={0}
    height={height}
  >
    <StyledTextarea
      viewport={viewport}
      maxLength={maxLength}
      value={value}
      autoCorrect={false}
      autoFocus={autoFocus}
      multiline
      textAlignVertical='top'
      height={height}
      customStyle={customStyle}
      {...props}
    />
    {maxLength > 0
      ? <StyledText
        fontSize={11}
        color={BROWN_GREY}
        customStyle={`
          align-self: flex-end;
          position: absolute;
          bottom: 0;
        `}
      >
        {maxLength - _.get(value, 'length', 0)}/{maxLength}
      </StyledText>
      : null
    }
  </StyledElevatedView>
)

Textarea.defaultProps = {
  height: 150
}

Textarea.propTypes = {
  height: PropTypes.number
}

export default connect(state => ({ viewport: state.viewport }))(Textarea)
