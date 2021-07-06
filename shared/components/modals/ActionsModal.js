import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Modal from 'components/modals/Modal'
import { StyledText } from 'components/StyledComponents'
import { DEEP_SKY_BLUE, CORAL, BLACK10, COOL_GRAY_TWO } from 'constants/colors'
import { getHeight } from 'utils/DynamicSize'
import { localizeText } from 'model/selectors/localize'

const Buttons = styled.View`
  justify-content: center;
  border-top-width: 1;
  border-color: ${BLACK10};
  width: 100%;
`
const StyledTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding-vertical: ${props => getHeight(21, props.viewport)};
  border-bottom-width: 1;
  border-color: ${BLACK10};
  width: 100%;
`

const ButtonComp = ({ viewport, onPress, disabled, danger, children }) => {
  return (
    <StyledTouchable onPress={onPress} viewport={viewport} disabled={disabled}>
      <StyledText fontSize={16} color={disabled ? COOL_GRAY_TWO : danger ? CORAL : DEEP_SKY_BLUE}>
        {children}
      </StyledText>
    </StyledTouchable>
  )
}
const Button = connect(state => ({ viewport: state.viewport }))(ButtonComp)

const ActionsModal = ({ viewport, localize, isVisible, onClose, buttons, title, onModalHide }) => {
  const onPress = cb => () => {
    cb()
    onClose()
  }
  return (
    <Modal isVisible={isVisible} onClose={onClose} onModalHide={onModalHide} title={localize(title)}>
      <Buttons viewport={viewport}>
        {buttons.map((button, i) => (
          <Button
            key={i}
            onPress={onPress(button.onPress)}
            disabled={button.disabled}
            danger={button.danger}>
            {localize(button.title)}
          </Button>
        ))}
      </Buttons>
    </Modal>
  )
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  localize: localizeText(state)
})

export default connect(mapStateToProps)(ActionsModal)
