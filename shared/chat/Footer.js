import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import styled from 'styled-components'

import TimerTrigger from 'shared/components/TimerTrigger'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { BROWN_GREY } from 'shared/constants/colors'

const FooterContainer = styled(View)`
  position: absolute;
  bottom: ${props => getHeight(3, props.viewport)};
  left: ${props => getWidth(10, props.viewport)};
  z-index: 2;
  width: 100%;
`

const Footer = props => {
  const { viewport, typingTime, text } = props
  return (
    <FooterContainer viewport={viewport}>
      <TimerTrigger
        timestamp={typingTime}
        componentActive={(
          <StyledText fontSize={10} color={BROWN_GREY}>
            {text}
          </StyledText>
        )}
      />
    </FooterContainer>
  )
}

Footer.propTypes = {
  viewport: PropTypes.object,
  typingTime: PropTypes.number,
  text: PropTypes.string
}

export default Footer