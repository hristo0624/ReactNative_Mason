import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import styled from 'styled-components'

import { getWidth, getHeight, fontSize } from 'shared/utils/dynamicSize'
import { WHITE } from 'shared/constants/colors'

const Close = styled.TouchableOpacity`
  margin-left: ${props => getWidth(5, props.viewport)};
  margin-top: ${props => getHeight(40, props.viewport)};
  margin-bottom: ${props => getHeight(40, props.viewport)};
  z-index: 2;
  ${props => props.customStyle}
`

const ModalCloseButton = ({ viewport, onClose, color, customStyle }) => {
  return (
    <Close viewport={viewport} onPress={onClose} customStyle={customStyle}>
      <Ionicons
        name='md-close'
        size={fontSize(40, viewport)}
        color={color}
      />
    </Close>
  )
}

ModalCloseButton.defaultProps = {
  color: WHITE
}

export default ModalCloseButton
