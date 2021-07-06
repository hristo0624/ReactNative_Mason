import React from 'react'
import { connect } from 'react-redux'
import Entypo from '@expo/vector-icons/Entypo'
import styled from 'styled-components'

import { fontSize } from 'shared/utils/dynamicSize'
import { LIGHT_PERIWINKLE } from 'shared/constants/colors'

const StyledIcon = styled(Entypo)`
  opacity: ${props => props.disabled ? 0.5 : 1};
  ${props => props.customStyle}
`
const Chevron = ({ viewport, size, customStyle, ...props }) => (
  <StyledIcon
    size={fontSize(size, viewport)}
    customStyle={customStyle}
    {...props}
  />
)

Chevron.defaultProps = {
  name: 'chevron-right',
  size: 20,
  color: LIGHT_PERIWINKLE
}

export default connect(state => ({ viewport: state.viewport }))(Chevron)
