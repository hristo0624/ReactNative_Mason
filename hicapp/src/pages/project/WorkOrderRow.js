import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ElevatedView from 'react-native-elevated-view'
import { View } from 'react-native'
import _ from 'lodash'

import { StyledText, Dot } from 'shared/components/StyledComponents'
import { WHITE, AQUA_MARINE, APPLE_GREEN, DARK, LIGHT_NAVY, LIGHT_GREY_BLUE, BLACK10, DUSK_TWO } from 'shared/constants/colors'
import { getWidth, getHeight, fontSize } from 'shared/utils/dynamicSize'
import DefaultButton from 'shared/components/buttons/DefaultButton'
import IconOrders from 'shared/icons/Orders'
import Chevron from 'shared/components/Chevron'

const Container = styled(View)`
  flex: 1;
  height: ${props => getHeight(65, props.viewport)};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const WorkOrderInfoContainer = styled(View)`
  margin-horizontal: ${props => getWidth(15, props.viewport)};
  margin-vertical: ${props => getHeight(15, props.viewport)};
`
const SpaceBetweenRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  ${props => props.customStyle};
`
const Row = styled(View)`
  flex-direction: row;
  align-items: baseline;
  ${props => props.customStyle};
`
const IconContainer = styled(View)`
  justify-content: center;
  align-items: center;
  width: ${props => getWidth(50, props.viewport)};
`
const InfoContainer = styled(View)`
  flex-direction: column;
  flex: auto;
`

const BidsInvitesContainer = styled(View)`
  flex-direction: column;
  width: ${props => getWidth(props.size, props.viewport)};
  align-items: center;
`

const WorkOrderRow = (props) => {
  const { workOrder, viewport } = props
  const members = _.get(workOrder, 'members', {})
  return (
    <Container
      key={workOrder.id}
      viewport={viewport}
    >
      <IconContainer viewport={viewport}>
        <IconOrders size={fontSize(20, viewport)} color={LIGHT_NAVY} />
        <StyledText
          fontSize={9}
          color={LIGHT_NAVY}
          customStyle={`margin-top: ${getHeight(3, viewport)}`}
        >
          Bidding
        </StyledText>
      </IconContainer>

      <InfoContainer>
        <StyledText
          fontSize={16}
          color={DUSK_TWO}
          bold
        >
          {_.get(workOrder, 'label', '')}
        </StyledText>
      </InfoContainer>
      <BidsInvitesContainer viewport={viewport} size={30}>
        <StyledText
          fontSize={20}
          color={LIGHT_NAVY}
        >
          0
        </StyledText>
        <StyledText
          fontSize={9}
          color={LIGHT_NAVY}
        >
          Bids
        </StyledText>
      </BidsInvitesContainer>

      <BidsInvitesContainer viewport={viewport} size={45}>
        <StyledText
          fontSize={20}
          color={AQUA_MARINE}
        >
          {_.size(members)}
        </StyledText>
        <StyledText
          fontSize={9}
          color={AQUA_MARINE}
        >
          Invitations
        </StyledText>
      </BidsInvitesContainer>
      <Chevron />
    </Container>

  )
}

WorkOrderRow.propTypes = {
  workOrder: PropTypes.object,
  viewport: PropTypes.object,
  onPress: PropTypes.func
}

export default WorkOrderRow
