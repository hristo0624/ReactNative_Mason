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
import { DUSK_TWO, WHITE, AQUA_MARINE, PALE_GREY, BLUEY_GREY } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { fontSize, getHeight } from 'shared/utils/dynamicSize'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import Chevron from 'shared/components/Chevron'
import { cutString } from 'shared/utils/stringUtils'
import IconAdd from 'shared/icons/AddExistingInventory'


const IconContainer = styled(View)`
  width: ${props => fontSize(50, props.viewport)};
  height: ${props => fontSize(38, props.viewport)};
  align-items: center;
  justify-content: flex-end;
`
const ModalContentWrapper = styled(View)`
  flex: 1;
  background-color: ${PALE_GREY};
`
const ChevronContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const Row = styled(View)`
 flex-direction: row;
 align-items: center;
 justify-content: center;
`
const InfoContainer = styled(View)`
  flex: 1;
`

export const DECLINE_OFFER = 'Decline offer'
export const CHAT = 'Chat'
export const MAP = 'Map of job location'

export const actions = {
  DECLINE_OFFER,
  CHAT,
  MAP
}

class SelectWorkOrderPanel extends Component {
  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  renderTitle = () => {
    const { workOrders } = this.props
    return (
      <TitleWithDesc
        title='Select a work order'
        desc={`from ${_.get(_.values(workOrders), [0, 'companyName'], 'pending...')}`}
      />
    )
  }

  onSelect = (workOrderId) => () => {
    this.props.onSelect(workOrderId)
  }

  renderWorkOrderRow = (wo) => {
    const { viewport } = this.props
    return (
      <Row>
        <IconContainer viewport={viewport}>
          <IconAdd size={fontSize(20, viewport)} color={AQUA_MARINE} />
          <StyledText
            fontSize={9}
            color={AQUA_MARINE}
            customStyle={`margin-top: ${getHeight(2, viewport)}`}
          >
            Job offer
          </StyledText>
        </IconContainer>

        <InfoContainer>
          <StyledText bold>
            {_.get(wo, 'label', '')}
          </StyledText>
          <StyledText
            fontSize={9}
            color={BLUEY_GREY}
            customStyle={`margin-top: ${getHeight(5, viewport)}`}
          >
            {cutString(_.get(wo, 'desc', ''), 40)}
          </StyledText>
        </InfoContainer>

        <ChevronContainer>
          <StyledText
            color={AQUA_MARINE}
          >
            View offer
          </StyledText>
          <Chevron name='chevron-right' color={AQUA_MARINE} />
        </ChevronContainer>
      </Row>
    )
  }

  workOrdersList = () => {
    const { workOrders } = this.props
    return _.map(workOrders, wo => {
      return {
        key: wo.id,
        title: wo.label,
        noMargin: true,
        customContent: this.renderWorkOrderRow(wo),
        onPress: this.onSelect(wo.id)
      }
    })
  }

  render () {
    const { viewport, visible, onClose, onModalHide } = this.props
    // const items = _.map(actions, k => ({
    //   customContent: this.renderItem(k),
    //   key: k,
    //   onPress: this.onPress(k),
    // }))
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        percHeight={0.4}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={this.renderTitle()}
            leftButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList
            sections={[
              {
                noBorder: true,
                height: getHeight(30, viewport),
                data: this.workOrdersList()
              },
              {
                noBorder: true,
                height: getHeight(30, viewport),
                data: []
              }
            ]}
          />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

SelectWorkOrderPanel.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null,
  companyName: ''
}

SelectWorkOrderPanel.propTypes = {
  visible: PropTypes.bool,
  companyName: PropTypes.string,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  workOrders: state.workOrders
})

export default connect(mapStateToProps)(SelectWorkOrderPanel)
