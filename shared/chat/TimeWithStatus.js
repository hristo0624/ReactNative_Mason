import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import styled from 'styled-components'
import _ from 'lodash'

import moment from 'moment-timezone'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'
import { ICE_BLUE, BLUEY_GREY, BATTLESHIP_GREY } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'
import MessageDeliveryStatusIcon from 'shared/chat/MessageDeliveryStatusIcon'
import deliveryStatus from 'shared/constants/deliveryStatus'

const Wrapper = styled(View)`
  height: ${props => getHeight(22, props.viewport)};
  margin-horizontal: ${props => getWidth(6, props.viewport)};
  margin-bottom: ${props => getHeight(2, props.viewport)};
  /* flex: 1; */
  justify-content: flex-end;
  align-self: flex-end;
`

const MessageStatusContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`
const TimeWithStatus = (props) => {
  const { viewport, subsApp } = props
  // console.log('render Time with status, current message', props)
  const m = moment(_.get(props, 'currentMessage.createdAt'))
  const isLeft = _.get(props, 'position') === 'left'
  if (isLeft) {
    return (
      <Wrapper viewport={viewport}>
        <StyledText
          fontSize={10}
          color={BATTLESHIP_GREY}
        >
          {m.format('LT')}
        </StyledText>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper viewport={viewport}>
        <MessageStatusContainer viewport={viewport}>
          <StyledText
            fontSize={10}
            color={subsApp ? ICE_BLUE : BLUEY_GREY}
            customStyle={`
              margin-right: ${getWidth(5, viewport)};
            `}
          >
            {m.format('LT')}
          </StyledText>
          <MessageDeliveryStatusIcon
            size={fontSize(18, viewport)}
            status={_.get(props, 'currentMessage.status', deliveryStatus.NEW)}
            subsApp={subsApp}
          />
        </MessageStatusContainer>
      </Wrapper>
    )
  }
}

TimeWithStatus.propTypes = {
  viewport: PropTypes.object
}

export default TimeWithStatus