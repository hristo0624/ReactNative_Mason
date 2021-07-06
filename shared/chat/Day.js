import React from 'react'
import moment from 'moment-timezone'
import _ from 'lodash'

import { StyledText } from 'shared/components/StyledComponents'
import { DUSK_TWO } from 'shared/constants/colors'
import { getHeight } from 'shared/utils/dynamicSize'

const Day = props => {
  const {
    currentMessage,
    previousMessage,
    nextMessage,
    inverted,
    isSameDay,
    viewport
  } = props

  if (
    currentMessage &&
    !isSameDay(currentMessage, inverted ? previousMessage : nextMessage)
  ) {
    return (
      <StyledText
        color={DUSK_TWO}
        fontSize={14}
        customStyle={`
          align-self: center;
          margin-vertical: ${getHeight(30, viewport)}
        `}
      >
        {moment(currentMessage.createdAt).format('MMM D, YYYY')}
      </StyledText>
    )
  } else {
    return null
  }
}

export default Day