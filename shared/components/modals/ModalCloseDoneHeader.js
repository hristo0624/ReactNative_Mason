import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import { getHeight, fontSize, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { LIGHT_NAVY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import PlainButton from 'shared/components/buttons/PlainButton'
import DefaultButton from 'shared/components/buttons/DefaultButton'
import NavBar from 'shared/components/NavBar'

const HeaderContainer = styled.View`
  width: 100%;
  height: ${props => getHeight(80, props.viewport)};
  align-items: center;
  justify-content: center;
`
const Close = styled.TouchableOpacity`
  position: absolute;
  right: ${props => fontSize(24, props.viewport)};
  top: ${props => fontSize(14, props.viewport)};
  z-index: 2;
`

const ModalCloseDoneHeader = ({ onClose, onDone, viewport }) => {
  const leftButton = (
    <PlainButton
      color={LIGHT_NAVY}
      onPress={onClose}
      title='Cancel'
      fontSize={16}
      customStyle={`
        margin-left: ${getWidth(10, viewport)};
        height: ${getHeight(40, viewport)};
      `}
    />
  )
  const rightButton = (
    <DefaultButton
      title='Done'
      buttonType={AQUA_MARINE}
      onPress={onDone}
      fontSize={16}
      customStyle={`
        margin-right: ${getWidth(10, viewport)};
        padding-horizontal: ${getWidth(0, viewport)};
        border-radius: ${fontSize(9, viewport)};
        height: ${getHeight(40, viewport)};
      `}
    />
  )

  return (
    <NavBar
      backgroundColor={WHITE}
      leftButton={leftButton}
      rightButton={rightButton}
    />
  )
}

export default connect(state => ({ viewport: state.viewport }))(ModalCloseDoneHeader)
