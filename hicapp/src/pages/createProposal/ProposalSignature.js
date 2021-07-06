import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE, DEEP_SKY_BLUE, DUSK } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import { StyledText } from 'shared/components/StyledComponents'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import ChooseSignaturePanel from 'components/panels/ChooseSignaturePanel'
import PlainButton from 'shared/components/buttons/PlainButton'
import SignatureModal from 'components/panels/SignatureModal'
import { saveSignature } from 'controllers/user'

const ButtonContainer = styled.View`
  width: 100%;
  padding-top: ${props => getHeight(20, props.viewport)};
  padding-bottom: ${props => getHeight(20, props.viewport)};
  padding-left: ${props => getWidth(50, props.viewport)};
  padding-right: ${props => getWidth(50, props.viewport)};
`

const SignatureImage = styled.Image`
  width: ${props => props.viewport.width};
  height: ${props => props.viewport.width / 2};
`
const ProgressContainer = styled.View`
  width: ${props => props.viewport.width};
  height: ${props => props.viewport.width / 2};
  align-items: center;
  justify-content: center;
`

@withMappedNavigationParams()
class ProposalSignature extends Component {
  constructor (props) {
    super(props)
    this.state = {
      signature: props.signature,
      progress: null
    }
  }

  renderSignature = () => {
    const { viewport, user } = this.props
    const { signature, progress } = this.state
    if (!_.isNil(progress)) {
      return (
        <ProgressContainer viewport={viewport}>
          <StyledText fontSize={16} color={DUSK}>{progress}%</StyledText>
        </ProgressContainer>
      )
    } else if (!_.has(signature, 'url')) {
      return (
        <ButtonContainer viewport={viewport}>
          <PrimaryButton
            title='Add signature'
            onPress={this.toggleSignatureModal}
          />
        </ButtonContainer>
      )
    } else {
      return (
        <React.Fragment>
          <SignatureImage
            viewport={viewport}
            source={{ uri: signature.url }}
          />
          { _.get(signature, 'userId') === user.id
            ? <PlainButton
              color={AQUA_MARINE}
              customStyle={`position: absolute; z-index: 2; right: ${getWidth(10, viewport)}; bottom: ${getWidth(5, viewport)};`}
              title='Edit'
              onPress={this.toggleSignatureModal}
              fontSize={16}
            />
            : null
          }
        </React.Fragment>
      )
    }
  }

  sections = () => {
    const { signature } = this.state
    const { user } = this.props
    let desc = _.get(signature, 'name')
    if (!desc) desc = _.get(signature, 'email')
    if (!desc) desc = _.get(user, 'profile.name', _.get(user, 'profile.email'))
    return [
      {
        data: [
          {
            title: 'Signer',
            key: 'signer',
            desc,
            actionField: <StyledText color={DEEP_SKY_BLUE}>Choose</StyledText>,
            onPress: this.toggleSignersPanel,
            noMargin: true
          },
          {
            key: 'sign',
            customContent: this.renderSignature()
          }
        ],
        isFirst: true
      }
    ]
  }

  save = () => {
    const { onChange } = this.props
    const { signature } = this.state
    onChange(signature)
    navigationService.goBack()
  }

  selectSigner = (v) => {
    const { account } = this.props
    const signature = {
      userId: v,
      name: _.get(account, ['admins', v, 'name'], null),
      email: _.get(account, ['admins', v, 'email'], null),
      url: _.get(account, ['admins', v, 'signature'], null)
    }
    this.setState({ signature })
  }

  toggleSignersPanel = () => this.setState({ signersPanelVisible: !this.state.signersPanelVisible })
  toggleSignatureModal = () => this.setState({ signatureModalVisible: !this.state.signatureModalVisible })

  renderPanel = () => {
    const { signature, signersPanelVisible } = this.state
    const { user } = this.props
    return (
      <ChooseSignaturePanel
        value={_.get(signature, 'userId', user.id)}
        onSelect={this.selectSigner}
        visible={signersPanelVisible}
        onClose={this.toggleSignersPanel}
      />
    )
  }

  onProgress = v => this.setState({ progress: v })

  onSaveSignature = async (sigBase64) => {
    console.log('save signature', sigBase64)
    const { user } = this.props
    const url = await saveSignature(sigBase64, this.onProgress)
    this.setState({
      signature: {
        userId: user.id,
        name: _.get(user, 'name', null),
        email: user.email,
        url
      },
      progress: null
    })
  }

  renderSignatureModal = () => {
    const { signatureModalVisible } = this.state
    return (
      <SignatureModal
        onSave={this.onSaveSignature}
        visible={signatureModalVisible}
        onClose={this.toggleSignatureModal}
      />
    )
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: 'Signature' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderPanel()}
        {this.renderSignatureModal()}
      </Page>
    )
  }
}

ProposalSignature.propTypes = {
  signature: PropTypes.object,
  onChange: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account,
  viewport: state.viewport
})

export default connect(mapStateToProps)(ProposalSignature)
