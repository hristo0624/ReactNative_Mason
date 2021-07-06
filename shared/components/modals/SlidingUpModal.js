import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'

import {WHITE} from 'shared/constants/colors'

class SlidingUpModal extends Component {

  render () {
    const {visible, onClose, title, viewport, swipeDownToClose, percHeight, backColor, onModalHide, ...rest} = this.props
    const modalStyle = {
      width: viewport.width,
      margin: 0,
      marginTop: viewport.height * (1 - percHeight),
      borderRadius: 10,
      paddingTop: 10,
      backgroundColor: backColor
    }
    return (
      <Modal
        backdropColor={'#000'}
        backdropOpacity={0.4}
        onBackdropPress={onClose}
        isVisible={visible}
        style={modalStyle}
        swipeDirection={swipeDownToClose ? ['down'] : []}
        onSwipeComplete={swipeDownToClose ? onClose : (() => null)}
        onModalHide={onModalHide}
        propagateSwipe
        {...rest}
      >
        {this.props.children}
      </Modal>
    )
  }
}


SlidingUpModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  swipeDownToClose: PropTypes.bool,
  percHeight: PropTypes.number,
  backColor: PropTypes.string,
  onModalHide: PropTypes.func
}

SlidingUpModal.defaultProps = {
  swipeDownToClose: false,
  percHeight: 0.6,
  backColor: WHITE,
  onModalHide: () => null
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SlidingUpModal)
