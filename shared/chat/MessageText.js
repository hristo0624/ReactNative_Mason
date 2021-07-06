import React from 'react'
import _ from 'lodash'

import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { WHITE, ALMOST_BLACK } from 'shared/constants/colors'

const Message = (props) => {
  const { viewport } = props
  const isLeft = _.get(props, 'position') === 'left'
  return (
    <StyledText
      size={14}
      color={isLeft ? ALMOST_BLACK : WHITE}
      customStyle={`
        margin-horizontal: ${getWidth(10, viewport)};
        margin-top: ${getHeight(5, viewport)};
      `}
    >
      {_.get(props, 'currentMessage.text')}
    </StyledText>
  )
}

export default Message