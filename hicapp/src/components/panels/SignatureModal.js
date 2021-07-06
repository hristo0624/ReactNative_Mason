import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SignaturePad from 'react-native-signature-pad'
import _ from 'lodash'

import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { AQUA_MARINE, PALE_GREY, WHITE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { getHeight } from 'shared/utils/dynamicSize'

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`
const Container = styled.View`
  margin-top: ${props => getHeight(20, props.viewport)};
  width: ${props => props.viewport.width};
  height: ${props => props.viewport.width / 2};

`

class SignatureModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sigPadKey: 1
    }
  }

  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  onChange = (v) => {
    this.setState({ sigImg: v })
  }

  onError = (er) => {
    console.log('onError', er)
  }

  renderContent = () => {
    const { viewport } = this.props
    const { sigPadKey } = this.state
    return (
      <Container viewport={viewport}>
        <SignaturePad
          key={sigPadKey}
          onChange={this.onChange}
          onError={this.onError}
          penColor='#000'
          style={{ flex: 1, backgroundColor: 'white', borderWidth: 0 }}
        />
      </Container>
    )
  }

  close = () => {
    const { onClose } = this.props
    this.setState({
      sigImg: null,
      sigPadKey: _.now()
    })
    onClose()
  }

  save = () => {
    console.log('save')
    const { sigImg } = this.state
    const { onSave } = this.props
    if (_.has(sigImg, 'base64DataUrl')) {
      console.log('sigImg exists, call onSave')
      onSave(sigImg.base64DataUrl)
      this.close()
    }
  }

  render () {
    const { viewport, visible, onClose } = this.props
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
            title={{ title: 'Draw signature' }}
            leftButton={<CloseButton color={AQUA_MARINE} onPressHandler={this.close} />}
            rightButton={{ title: 'save', tintColor: AQUA_MARINE, handler: this.save }}
          />
          {this.renderContent()}
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

SignatureModal.defaultProps = {
  visible: false,
  onSave: () => null,
  onClose: () => null
}

SignatureModal.propTypes = {
  visible: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SignatureModal)
