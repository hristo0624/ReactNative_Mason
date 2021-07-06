import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { View } from 'react-native'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import Checkbox from 'shared/icons/Checkbox'
import { getHeight } from 'shared/utils/dynamicSize'
import amountType from 'shared/constants/amountType'

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class SelectAmountType extends Component {
  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  renderCheckbox = (v) => {
    const { value, viewport } = this.props
    if (value === v) {
      return <Checkbox color={AQUA_MARINE} size={getHeight(26, viewport)} />
    } else {
      return <View />
    }
  }

  render () {
    const { viewport, visible, onClose } = this.props
    const items = [
      {
        title: 'Percentage (%)',
        key: amountType.PERCENTAGE,
        onPress: this.onPress(amountType.PERCENTAGE),
        actionField: this.renderCheckbox(amountType.PERCENTAGE)
      },
      {
        title: 'Flat amount ($)',
        key: amountType.FLAT_AMOUNT,
        onPress: this.onPress(amountType.FLAT_AMOUNT),
        actionField: this.renderCheckbox(amountType.FLAT_AMOUNT)
      }
    ]

    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Deposit' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList sections={[{ data: items }]} />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

SelectAmountType.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

SelectAmountType.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SelectAmountType)
