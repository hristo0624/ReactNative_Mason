import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Modal, TextStyle, TextContainer, Stack, ProgressBar } from '@shopify/polaris'
import _ from 'lodash'
import SignatureCanvas from 'react-signature-canvas'

class SignatureModal extends Component {
  constructor (props) {
    super(props)
    console.log('SignatureModal constructor, value', props.value)
    this.state = {
      showSignatureModal: false,
      signatureWidth: 0,
      signatureComment: ''
    }
  }

  save = (v) => {
    const canvasEmpty = this.sigCanvas.isEmpty()
    if (!canvasEmpty) {
      const { onSave } = this.props
      const dataUrl = this.sigCanvas.toDataURL()
      onSave(dataUrl)
    }
  }

  clear = () => {
    this.sigCanvas.clear()
  }

  onSigCanvasMounted = (ref) => {
    if (ref) ref.clear()
    this.sigCanvas = ref
  }

  onModalCardMounted = (ref) => {
    if (ref) {
      // console.log('onModalCardMounted', ref)
      const w = ref.getBoundingClientRect().width
      console.log('onModalCardMounted', w)
      this.setState({ signatureWidth: w })
    }
  }

  renderProgress = () => {
    const { progress } = this.props
    if (!_.isNil(progress)) {
      return <ProgressBar size='small' progress={75} />
    }
  }

  render = () => {
    const { modalProps, cardProps, progress } = this.props
    const { signatureWidth } = this.state
    return (
      <Modal
        secondaryActions={[{ content: 'Clear', onAction: this.clear, disabled: !_.isNil(progress) }]}
        primaryAction={[{ content: 'Insert', onAction: this.save, disabled: !_.isNil(progress) }]}
        title='CREATE SIGNATURE'
        {...modalProps}
      >

        <Card {...cardProps}>
          <Card.Section subdued title='Draw your signature'>
            <Stack vertical>
              <div ref={this.onModalCardMounted}>
                <SignatureCanvas
                  clearButton
                  ref={this.onSigCanvasMounted}
                  penColor='black'
                  backgroundColor='white'
                  canvasProps={{ width: signatureWidth, height: signatureWidth * 0.5, style: { backgroundColor: 'white' } }}
                />
              </div>
              <TextContainer>
                <TextStyle variation='subdued'>
                    I understand this is a legal representation of my signature
                </TextStyle>
              </TextContainer>
            </Stack>
            {this.renderProgress()}
          </Card.Section>
        </Card>
      </Modal>
    )
  }
}

SignatureModal.defaultProps = {
  modalProps: {},
  cardProps: {}
}

SignatureModal.propTypes = {
  modalProps: PropTypes.object,
  cardProps: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  progress: PropTypes.number
}

export default SignatureModal
