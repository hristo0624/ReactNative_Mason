import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { TextInput, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

import { getWidth, fontSize } from 'shared/utils/dynamicSize'
import { BLACK10 } from 'constants/colors'

const Container = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${props => getWidth(280, props.viewport)};
  height: ${props => fontSize(40, props.viewport)};
  border-width: ${props => props.border ? 1 : 0};
  border-color: ${BLACK10};
  border-radius: 8;
  ${props => props.color ? `background-color: ${props.color}` : ''};
`
const StyledIcon = styled(Ionicons)`
  margin-left: ${props => getWidth(8, props.viewport)};
  margin-right: ${props => getWidth(8, props.viewport)};
  color: ${BLACK10};
`
const StyledTextInput = styled(TextInput)`
  flex: 1;
`
const SearchField = ({ viewport, border, color, ...rest }) => (
  <Container viewport={viewport} border={border} color={color}>
    <StyledIcon viewport={viewport} name='ios-search' size={fontSize(20, viewport)} />
    <StyledTextInput
      viewport={viewport}
      placeholderTextColor={BLACK10}
      autoCorrect={false}
      underlineColorAndroid='rgba(0,0,0,0)'
      autoCapitalize='none'
      {...rest}
    />
  </Container>
)

SearchField.defaultProps = {
  border: true,
  clearButtonMode: 'while-editing'
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SearchField)
