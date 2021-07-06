import React from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { AQUA_MARINE } from 'shared/constants/colors'
import { StyledImage } from 'shared/components/StyledComponents'

const StyledView = styled(View)`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size / 2};
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  ${props => props.customStyle}
`
const StyledText = styled(Text)`
  color: white;
  font-size: ${props => props.size / 2};
`

const Avatar = ({ url,  initials, size, color, customStyle }) => {
  if (url) {
    return (
      <StyledImage
        size={size}
        source={{ uri: url }}
        resizeMode='contain'
        customStyle={customStyle}
      />
    )
  } else {
    return (
      <StyledView color={color} size={size} customStyle={customStyle}>
        <StyledText size={size}>{initials}</StyledText>
      </StyledView>
    )
  }
}

Avatar.defaultProps = {
  color: AQUA_MARINE
}

Avatar.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number.isRequired,
  url: PropTypes.string,
  initials: PropTypes.string,
  customStyle: PropTypes.string
}

export default Avatar
