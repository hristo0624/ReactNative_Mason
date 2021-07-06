import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Page, Badge, ProgressBar } from '@shopify/polaris'
import { firebase } from '@firebase/app'
import _ from 'lodash'

import PreviewWrapper from 'documents/PreviewWrapper'
import PreivewContainer from 'documents/components/PreviewContainer'
import Contract from 'documents/Contract'
import SignatureModal from 'components/common/SignatureModal'
import { storageRef, ref } from 'constants/firebase'

class ContractPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      savingProgress: null
    }
  }

  onSaveSignature = async (sigBase64) => {
    this.toggleSignatureModal()
    const { accId, proposal } = this.props
    const p = `contractSignatures/${accId}/${proposal.id}/owner`
    console.log('upload sig to', p)
    const uploadTask = storageRef.child(p).putString(sigBase64, 'data_url')
    uploadTask.on('state_changed', snapshot => {
      this.setState({
        savingProgress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      })
    })
    const snapshot = await uploadTask
    const url = await snapshot.ref.getDownloadURL()
    const sig = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      src: url
    }
    console.log('save to db sig', sig)
    await ref.child(`proposals/${accId}/${proposal.id}/ownerContractSignature`).set(sig)
    this.setState({ savingProgress: null })
  }

  renderSignatureModal = () => {
    const { modalVisible } = this.state
    return (
      <SignatureModal
        onSave={this.onSaveSignature}
        modalProps={{
          open: modalVisible,
          onClose: this.toggleSignatureModal,
          title: 'CREATE SIGNATURE'
        }}
      />
    )
  }

  renderProgress = () => {
    const { savingProgress } = this.state
    if (!_.isNil(savingProgress)) {
      return <ProgressBar progress={savingProgress} size='small' />
    }
  }

  toggleSignatureModal = () => this.setState({ modalVisible: !this.state.modalVisible })

  render () {
    const { proposal } = this.props
    const { savingProgress } = this.state
    const titleMetadata = proposal.ownerContractSignature ? <Badge status='success'>Signed</Badge> : <Badge status='default'>Waiting for signing</Badge>
    return (
      <Page
        title='Contract'
        titleMetadata={titleMetadata}
        primaryAction={proposal.ownerContractSignature ? null : { content: 'Sign', onAction: this.toggleSignatureModal, disabled: !_.isNil(savingProgress) }}
      >
        {this.renderProgress()}
        <PreivewContainer>
          <PreviewWrapper>
            <Contract {...proposal} />
          </PreviewWrapper>
        </PreivewContainer>
        {this.renderSignatureModal()}
      </Page>
    )
  }
}

ContractPage.propTypes = {
  proposal: PropTypes.object,
  accId: PropTypes.string
}

export default ContractPage
