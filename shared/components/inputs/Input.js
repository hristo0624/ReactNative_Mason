import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextInput } from 'react-native'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'

import { getHeight, fontSize } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { WHITE } from 'shared/constants/colors'
import { DEFAULT_FONT } from 'constants/index'

const ERROR = 'yellow'

const InputWrapper = styled.View`
  width: 100%;
  ${props => props.customStyle || ''}
`
const StyledTextInput = styled(TextInput)`
  width: 100%;
  height: ${props => getHeight(40, props.viewport)};
  border-bottom-width: 2;
  border-color: ${props => props.error ? ERROR : '#ebebeb'};
  color: ${WHITE};
  font-size: ${props => fontSize(16, props.viewport)};
  font-family: ${DEFAULT_FONT};
  margin-vertical: ${props => getHeight(5, props.viewport)};
`
const ErrorText = styled(StyledText)`
  color: ${ERROR};
`

class Input extends Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }
  }

  onBlur = () => {
    const { onBlur } = this.props
    onBlur()
    this.setState({ active: false })
  }

  onFocus = () => this.setState({ active: true })

  render () {
    const { placeholder, getRef, viewport, error, onBlur, label, customStyle, ...rest } = this.props
    const { active } = this.state

    return (
      <InputWrapper customStyle={customStyle}>
        <StyledText fontSize={14} color={WHITE}>{_.toUpper(label)}</StyledText>
        <StyledTextInput
          viewport={viewport}
          active={active}
          autoCapitalize='none'
          underlineColorAndroid='transparent'
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          placeholderTextColor='white'
          placeholder={placeholder}
          autoCorrect={false}
          ref={getRef}
          {...rest}
        />
        <ErrorText viewport={viewport} fontSize={14}>{error}</ErrorText>
      </InputWrapper>
    )
  }
}

Input.defaultProps = {
  getRef: () => null,
  error: '',
  onBlur: () => null,
  ...TextInput.defaultProps
}

Input.propTypes = {
  getRef: PropTypes.func,
  viewport: PropTypes.object.isRequired,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  ...TextInput.propTypes
}

export default connect(state => ({ viewport: state.viewport }))(Input)
