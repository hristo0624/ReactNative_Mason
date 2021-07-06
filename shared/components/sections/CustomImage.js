import React from 'react'
import styled from 'styled-components'

import { getWidth } from 'shared/utils/dynamicSize'

const Wrapper = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`
const StyledImage = styled.Image`
  width: ${props => getWidth(200, props.viewport)};
  height: ${props => getWidth(200, props.viewport)};
`
const CustomImage = ({ viewport, attachment: { uri, url }, onPress }) => (
  <Wrapper activeOpacity={0.75} onPress={onPress}>
    <StyledImage source={{ uri: url || uri }} resizeMode='cover' viewport={viewport} />
  </Wrapper>
)

export default CustomImage
