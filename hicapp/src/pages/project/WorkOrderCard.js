import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ElevatedView from 'react-native-elevated-view'
import { View } from 'react-native'
import _ from 'lodash'

import { StyledText, Dot } from 'shared/components/StyledComponents'
import { WHITE, AQUA_MARINE, APPLE_GREEN, DARK, LIGHT_NAVY, LIGHT_GREY_BLUE } from 'shared/constants/colors'
import { getWidth, getHeight, fontSize } from 'shared/utils/dynamicSize'
import DefaultButton from 'shared/components/buttons/DefaultButton'

const Container = styled(ElevatedView)`
  background-color: ${WHITE};
  margin-horizontal: ${props => getWidth(10, props.viewport)};
  margin-vertical: ${props => getHeight(10, props.viewport)};
  border-radius: ${props => fontSize(10, props.viewport)};
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

const WorkOrderCard = (props) => {
  const { workOrder, viewport, onPress } = props
  const members = _.get(workOrder, 'members', {})
  return (
    <Container
      key={workOrder.id}
      elevation={3}
      viewport={viewport}
    >
      <WorkOrderInfoContainer viewport={viewport}>
        <SpaceBetweenRow>
          <Row customStyle='flex: 5;'>
            <StyledText fontSize={20} bold color={DARK}>
              {_.get(workOrder, 'label', 'Untitled')}
            </StyledText>
            <Dot
              size={fontSize(10, viewport)}
              color={APPLE_GREEN}
              customStyle={`margin-left: ${getWidth(5, viewport)}`}
            />
          </Row>
        </SpaceBetweenRow>

        <Row customStyle={`margin-top: ${getHeight(15, viewport)}`}>
          <StyledText color={LIGHT_NAVY}>Description</StyledText>
        </Row>

        <Row>
          <StyledText color={LIGHT_GREY_BLUE} fontSize={12}>
            {_.get(workOrder, 'desc', '...')}
          </StyledText>
        </Row>

        <SpaceBetweenRow customStyle={`margin-top: ${getHeight(15, viewport)}`}>
          <StyledText color={LIGHT_NAVY} customStyle='flex: 1.2;'>Invited subs</StyledText>
          <StyledText color={LIGHT_NAVY} customStyle='flex: 1;'>Bids</StyledText>
          <StyledText color={LIGHT_NAVY} customStyle='flex: 0.6;'>Low bid</StyledText>
        </SpaceBetweenRow>
        <SpaceBetweenRow customStyle={`margin-vertical: ${getHeight(5, viewport)}`}>
          <StyledText color={LIGHT_GREY_BLUE} fontSize={12} customStyle='flex: 1.2;'>
            {_.size(members)}
          </StyledText>
          <StyledText color={LIGHT_GREY_BLUE} fontSize={12} customStyle='flex: 1;'>0</StyledText>
          <StyledText color={LIGHT_GREY_BLUE} fontSize={12} customStyle='flex: 0.6;'>$0</StyledText>
        </SpaceBetweenRow>
      </WorkOrderInfoContainer>
      <DefaultButton
        title='View bids'
        buttonType={AQUA_MARINE}
        fontSize={16}
        customStyle={`
          height:${getHeight(44, viewport)};
          width: 100%;
          border-bottom-left-radius : ${fontSize(10, props.viewport)};
          border-bottom-right-radius : ${fontSize(10, props.viewport)};
        `}
        onPress={onPress}
      />
    </Container>

  )
}

WorkOrderCard.propTypes = {
  workOrder: PropTypes.object,
  viewport: PropTypes.object,
  onPress: PropTypes.func
}

export default WorkOrderCard
