import React from 'react'
import { View } from 'react-native'

import { StyledText } from 'shared/components/StyledComponents'

import { RED_PINK } from 'shared/constants/colors'

const SectionDeleteButton = ({ title, color }) => {
  return (
    <View style={{ flex: 1 }}>
      <StyledText
        customStyle={`align-self:center;`}
        color={color || RED_PINK}
      >
        {title}
      </StyledText>
    </View>
  )
}

export default SectionDeleteButton
