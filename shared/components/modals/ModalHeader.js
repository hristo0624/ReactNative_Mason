import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import { getHeight, fontSize } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { DARK_BLUE_GREY } from 'shared/constants/colors'

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

const ModalHeader = ({ title, onClose, viewport }) => (
  <HeaderContainer viewport={viewport}>
    <StyledText fontSize={20} color={DARK_BLUE_GREY} bold>{title}</StyledText>
    <Close viewport={viewport} onPress={onClose}>
      <Ionicons
        name='md-close'
        size={fontSize(30, viewport)}
        color={DARK_BLUE_GREY}
      />
    </Close>
  </HeaderContainer>
)

export default connect(state => ({ viewport: state.viewport }))(ModalHeader)
