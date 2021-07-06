import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Picker } from 'react-native'

import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { LIGHT_NAVY } from 'shared/constants/colors'
import { DEFAULT_FONT } from 'constants/index'
import { fontSize } from 'shared/utils/dynamicSize'
import ModalCloseDoneHeader from 'shared/components/modals/ModalCloseDoneHeader'

const ModalContentWrapper = styled.View`
  flex: 1;
`
class ModalSelect extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedId: props.selectedId
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.selectedId !== state.prevSelectedId) {
      return {
        prevSelectedId: props.selectedId,
        selectedId: props.selectedId
      }
    } else {
      return null
    }
  }

  onValueChange = id => this.setState({ selectedId: id })

  onDone = () => {
    const { selectedId } = this.state
    const { onSelect, onClose, closeOnSelect } = this.props
    onSelect(selectedId)
    if (closeOnSelect) onClose()
  }

  renderPickerItem = (item) => {
    return (
      <Picker.Item key={item.id} label={item.title} value={item.id} />
    )
  }

  render () {
    const { viewport, items, visible, onClose, percHeight, ...rest } = this.props
    const { selectedId } = this.state
    const itemStyle = {
      fontSize: fontSize(16, viewport),
      color: LIGHT_NAVY,
      fontFamily: DEFAULT_FONT
    }
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        swipeDownToClose
        percHeight={percHeight}
        {...rest}
      >
        <ModalContentWrapper viewport={viewport}>
          <ModalCloseDoneHeader
            onClose={onClose}
            onDone={this.onDone}
          />
          <Picker
            selectedValue={selectedId}
            itemStyle={itemStyle}
            onValueChange={this.onValueChange}
            mode='dropdown'
          >
            {items.map(this.renderPickerItem)}
          </Picker>
        </ModalContentWrapper>
        {this.props.children}
      </SlidingUpModal>
    )
  }
}

ModalSelect.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null,
  items: [],
  percHeight: 0.4,
  closeOnSelect: true
}

ModalSelect.propTypes = {
  items: PropTypes.array,
  selectedId: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  percHeight: PropTypes.number,
  closeOnSelect: PropTypes.bool
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ModalSelect)
