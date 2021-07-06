import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Image, View } from 'react-native'

import CheckboxComp from 'shared/icons/Checkbox'
import { getWidth, fontSize } from 'shared/utils/dynamicSize'
import { BLACK20 } from 'shared/constants/colors'

const Circle = styled(View)`
  width: ${props => props.size};
  height: ${props => props.size};
  border-width: 1;
  border-radius: ${props => props.size / 2};
  border-color: ${BLACK20};
`

const Checkbox = ({ checked, size, color, viewport }) => {
  const scaledSize = fontSize(size, viewport)
  return (checked
    ? <CheckboxComp size={scaledSize} color={color} />
    : <Circle size={scaledSize} />
  )
}

Checkbox.defaultProps = {
  size: 32,
  checked: false,
}

Checkbox.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  checked: PropTypes.bool
}

export default connect(state => ({ viewport: state.viewport }))(Checkbox)
