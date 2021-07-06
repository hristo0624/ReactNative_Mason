import React, {Component} from 'react'
import {connect} from 'react-redux'
import {TextInput} from 'react-native'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'

import {fontSize, getWidth} from 'shared/utils/dynamicSize'
import {MIDNIGHT_EXPRESS} from 'shared/constants/colors'
import {REGULAR_FONT} from 'constants/index'

const StyledTextInput = styled(TextInput)`
  width: ${props => getWidth(200, props.viewport)};
  text-align: right;
  font-family: ${REGULAR_FONT};
  font-size: ${props => fontSize(16, props.viewport)};
  color: ${MIDNIGHT_EXPRESS};
  opacity: ${props => props.editable ? 1 : 0.5};
  ${props => props.customStyle || ''}
`

class SectionItemInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      focused: props.focused
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.value !== state.prevValue || props.blurValue !== state.blurValue) {
      return {
        value: props.value,
        blurValue: props.blurValue,
        prevValue: props.value
      }
    } else {
      return null
    }
  }

  onSubmit = () => {
    const {value} = this.state
    const {onComplete} = this.props
    this.setState({
      prevValue: undefined,
      focused: false
    }, () => {
      if (onComplete) onComplete(value)
    })
  }

  onChange = (v) => {
    const {pattern, maxLen} = this.props
    let value = pattern ? v.replace(pattern, '') : v
    if (maxLen) {
      value = value.substring(0, maxLen)
    }
    this.setState({value})
    this.props.onChange(value)
  }

  onFocus = () => {
    this.setState({focused: true})
    if (_.has(this.props, 'onFocus')) this.props.onFocus()
  }

  onContainerClick = () => {
    if (this.inputRef) {
      this.inputRef.focus()
    }
  }

  onInputMounted = (ref) => {
    this.inputRef = ref
  }

  render () {
    const {placeholder, viewport, keyboardType, disabled, customStyle, returnKeyType, maxLength} = this.props
    const {value, blurValue, focused} = this.state
    let v = value
    if (blurValue && !focused) v = blurValue
    return (
      <StyledTextInput
        viewport={viewport}
        autoCapitalize='none'
        autoCorrect={false}
        autoFocus={focused}
        underlineColorAndroid='rgba(0,0,0,0)'
        clearButtonMode='while-editing'
        value={v}
        placeholder={placeholder}
        onChangeText={this.onChange}
        blurOnSubmit
        keyboardType={keyboardType}
        onBlur={this.onSubmit}
        onFocus={this.onFocus}
        editable={!disabled}
        ref={this.onInputMounted}
        returnKeyType={returnKeyType || 'done'}
        customStyle={customStyle}
        maxLength= {maxLength}
      />
    )
  }
}

SectionItemInput.defaultProps = {
  value: '',
  keyboardType: 'default',
  onChange: () => {
  },
  disabled: false
}

SectionItemInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onComplete: PropTypes.func,
  viewport: PropTypes.object.isRequired,
  keyboardType: PropTypes.string,
  onChange: PropTypes.func,
  blurValue: PropTypes.string,
  disabled: PropTypes.bool,
  focused: PropTypes.bool,
  maxLen: PropTypes.number,
  customStyle: PropTypes.string,
  onFocus: PropTypes.func,
  maxLength: PropTypes.number
}

export default connect(state => ({viewport: state.viewport}), null, null, {forwardRef: true})(SectionItemInput)
