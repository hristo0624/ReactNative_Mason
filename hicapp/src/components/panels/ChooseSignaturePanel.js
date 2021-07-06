import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { View } from 'react-native'
import _ from 'lodash'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import Checkbox from 'shared/icons/Checkbox'
import { getHeight } from 'shared/utils/dynamicSize'

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class ChooseSignaturePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps (props, state) {
    if (props.account !== state.prevAccount) {
      const signatureOptions = []
      const admins = _.get(props, 'account.admins', {})
      for (const adminId in admins) {
        const admin = admins[adminId]
        if (adminId === props.user.id || _.has(admin, 'signature')) {
          signatureOptions.push(admin)
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
    const { signatureOptions } = this.state
    const items = _.map(signatureOptions, admin => ({
      title: admin.name,
      desc: `${admin.email} (${admin.role})`,
      key: admin.id,
      onPress: this.onPress(admin.id),
      actionField: this.renderCheckbox(admin.id)
    }))

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
            title={{ title: 'Signers' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList sections={[{ data: items }]} />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

ChooseSignaturePanel.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

ChooseSignaturePanel.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  account: state.account,
  user: state.user
})

export default connect(mapStateToProps)(ChooseSignaturePanel)
