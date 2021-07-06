import React from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'

import Modal from 'shared/components/modals/Modal'
import { StyledText } from 'shared/components/StyledComponents'
import { DEEP_SKY_BLUE, BLACK10, CORAL, DUSK } from 'shared/constants/colors'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'

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

const descStyle = css`
  margin-bottom: ${props => getHeight(25, props.viewport)};
  margin-horizontal: ${props => getWidth(25, props.viewport)};
`

const Button = ({ viewport, onPress, children, color }) => {
  return (
    <StyledTouchable onPress={onPress} viewport={viewport}>
      <StyledText fontSize={16} color={color || DEEP_SKY_BLUE}>
        {children}
      </StyledText>
    </StyledTouchable>
  )
}

const ConfirmationModal = (props) => {
  const { viewport, isVisible, onClose, onApply, onReject, onModalHide,
    title, desc, positiveTitle, negativeTitle, showCancel, invert } = props
  const onRejectFunc = onReject || onClose
  const applyButton = positiveTitle ? (
    <Button viewport={viewport} onPress={onApply} color={invert && CORAL}>
      {positiveTitle}
    </Button>
  ) : null
  const rejectButton = negativeTitle ? (
    <Button viewport={viewport} onPress={onRejectFunc} color={!invert && CORAL}>
      {negativeTitle}
    </Button>
  ) : null
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      showCancel={showCancel}
      onModalHide={onModalHide}
      title={title}
    >
      { !!desc && <StyledText fontSize={16} color={DUSK} customStyle={descStyle} textAlign={title ? 'left' : 'center'}>
        {desc}
      </StyledText>
      }
      <Buttons viewport={viewport}>
        {invert
          ? <React.Fragment>
            {rejectButton}
            {applyButton}
          </React.Fragment>
          : <React.Fragment>
            {applyButton}
            {rejectButton}
          </React.Fragment>
        }
      </Buttons>
    </Modal>
  )
}

ConfirmationModal.defaultProps = {
  positiveTitle: 'yes',
  negativeTitle: 'no',
  showCancel: true,
  invert: false
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ConfirmationModal)
