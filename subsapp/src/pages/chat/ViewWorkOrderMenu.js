import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { View } from 'react-native'
import { Entypo } from '@expo/vector-icons'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { StyledText } from 'shared/components/StyledComponents'
import { DUSK_TWO, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { fontSize } from 'shared/utils/dynamicSize'


const IconContainer = styled(View)`
  width: ${props => fontSize(32, props.viewport)};
  height: ${props => fontSize(20, props.viewport)};
  justify-content: center;
`
const ModalContentWrapper = styled(View)`
  flex: 1;
`
const Row = styled(View)`
 flex-direction: row;
 align-items: center;
 justify-content: center;
`

export const DECLINE_OFFER = 'Decline offer'
export const CHAT = 'Chat'
export const MAP = 'Map of job location'

export const actions = {
  DECLINE_OFFER,
  CHAT,
  MAP
}

class ViewWorkOrderMenu extends Component {
  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  iconByItemKind = (itemKind) => {
    const { viewport } = this.props
    switch (itemKind) {
      case DECLINE_OFFER: return <Entypo name='block' size={fontSize(20, viewport)} color={DUSK_TWO} />
      case MAP: return <Entypo name='location' size={fontSize(20, viewport)} color={DUSK_TWO} />
      case CHAT: return <Entypo name='chat' size={fontSize(20, viewport)} color={DUSK_TWO} />
      default: return null
    }
  }

  renderItem = (itemKind) => {
    const { viewport } = this.props
    return (
      <Row>
        <IconContainer viewport={viewport}>
          {this.iconByItemKind(itemKind)}
        </IconContainer>
        <StyledText
          color={DUSK_TWO}
          bold
        >
          {itemKind}
        </StyledText>
      </Row>
    )
  }

  render () {
    const { viewport, visible, onClose, onModalHide } = this.props
    const items = _.map(actions, k => ({
      customContent: this.renderItem(k),
      key: k,
      onPress: this.onPress(k),
    }))
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        percHeight={0.4}
        onModalHide={() => {
          console.log('work order view menu, on modal hide callback', onModalHide)
          onModalHide()
        }}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Actions' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList
            sections={[{
              noBorder: true,
              data: items
            }]}
            noHeader
          />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

ViewWorkOrderMenu.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

ViewWorkOrderMenu.propTypes = {
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onModalHide: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ViewWorkOrderMenu)
