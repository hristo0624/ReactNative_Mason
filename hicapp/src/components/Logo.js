import React from 'react'

import { StyledText } from 'shared/components/StyledComponents'
import { LIGHT_NAVY } from 'shared/constants/colors'
import { LOGO_FONT } from 'constants/index'

const Logo = ({ size, dot }) => (
  <StyledText
    color={LIGHT_NAVY}
    fontSize={size}
    customStyle={{ fontFamily: LOGO_FONT }}
  >
    Mason{dot ? '.' : null}
  </StyledText>
)

Logo.defaultProps = {
  size: 70,
  dot: false
}

export default Logo
