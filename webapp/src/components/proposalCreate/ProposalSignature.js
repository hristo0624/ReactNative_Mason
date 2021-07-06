import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Layout, Card, FormLayout, Select, Stack, Button, Banner } from '@shopify/polaris'

import SignatureModal from 'components/common/SignatureModal'
import { saveSignature } from 'controllers/user'

class ProposalSignature extends Component {
  constructor (props) {
    super(props)
    this.state = {
      signatureOptions: [],
      modalVisible: false,
      progress: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.account !== state.prevAccount) {
      const signatureOptions = []
      const admins = _.get(props, 'account.admins', {})
      for (const adminId in admins) {
        const admin = admins[adminId]
        if (adminId === props.user.id || _.has(admin, 'signature')) {
          signatureOptions.push({
            label: `${admin.name} ${admin.email} (${admin.role})`,
            value: adminId
          })
        }
      }
      return ({
        prevAccount: props.account,
        signatureOptions
      })
    }
    // console.log('GDSFP return new state', newState)
    return null
  }

  toggleSignatureModal = () => this.setState({
    modalVisible: !this.state.modalVisible,
    progress: null
  })

  renderSignatureImage = () => {
    const { user, proposal } = this.props
    const selectedSignature = _.get(proposal, 'signature.userId', _.get(user, 'id'))
    const signatureUrl = _.get(proposal, 'signature.url')
    const isMySignature = user && selectedSignature === _.get(user, 'id')
    if (signatureUrl) {
      return (
        <React.Fragment>
          <Stack distribution='equalSpacing'>
            <span>SIGNATURE</span>
            {isMySignature ? <Button plain onClick={this.toggleSignatureModal}>Edit signature</Button> : null}
            <img src={signatureUrl} />
          </Stack>
        </React.Fragment>
      )
    } else {
      return (
        <Banner
          action={{ content: 'Add signature', onAction: this.toggleSignatureModal }}
          status='warning'
        >
          <p>You have no a signature added yet.</p>
        </Banner>
      )
    }
  }

  onProgress = (v) => this.setState({ progress: v })

  onSaveSignature = async (sigBase64) => {
    const { onChange, user } = this.props
    const url = await saveSignature(sigBase64, this.onProgress)
    onChange({
      userId: user.id,
      name: _.get(user, 'name', null),
      email: user.email,
      url
    })
    this.setState({
      progress: null,
      modalVisible: false
    })
  }

  renderSignatureModal = () => {
    const { modalVisible, progress } = this.state
    return (
      <SignatureModal
        onSave={this.onSaveSignature}
        progress={progress}
        modalProps={{
          open: modalVisible,
          onClose: this.toggleSignatureModal,
          title: 'CREATE SIGNATURE'
        }}
      />
    )
  }

  onChangeSignature = (v) => {
    console.log('onChangesignature', v)
    const { account, onChange } = this.props
    onChange({
      userId: v,
      name: _.get(account, ['admins', v, 'name'], null),
      email: _.get(account, ['admins', v, 'email'], null),
      url: _.get(account, ['admins', v, 'signature'], null)
    })
  }

  render () {
    const { signatureOptions } = this.state
    const { account, user, proposal, errors, resetError } = this.props
    const selectedSignature = _.get(proposal, 'signature.userId', _.get(user, 'id'))
    // const isMySignature = user && selectedSignature === _.get(user, 'id')
    let title = 'Choose signer from your company'
    if (_.has(account, 'company.name')) title = `Choose signer from ${account.company.name}`
    return (
      <Layout.AnnotatedSection
        title='Company signature'
        description='To generate a signed contract ready for the homeowner, choose a signer from your company and add a signature.'
        sectioned
      >
        <Card
          title={title}
        >
          <Card.Section>
            <FormLayout>
              <Select
                options={signatureOptions}
                value={selectedSignature}
                onChange={this.onChangeSignature}
                error={_.get(errors, 'signature')}
                onFocus={resetError('signature')}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section subdued>
            {this.renderSignatureImage()}
          </Card.Section>
        </Card>
        {this.renderSignatureModal()}
      </Layout.AnnotatedSection>
    )
  }
}

ProposalSignature.propTypes = {
  proposal: PropTypes.object,
  onChange: PropTypes.func,
  errors: PropTypes.object,
  resetError: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account
})
export default connect(mapStateToProps)(ProposalSignature)
