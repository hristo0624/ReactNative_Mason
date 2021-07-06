import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'

import { DARK_SKY_BLUE } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'

const Container = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${props => getWidth(70, props.viewport)};
`
const Icon = styled.View`
  height: ${props => fontSize(props.size, props.viewport)};
  width: ${props => fontSize(props.size, props.viewport)};
  border-radius: ${props => fontSize(props.size / 2, props.viewport)};
  background-color: ${props => props.color};
  margin-bottom: ${props => getHeight(5, props.viewport)};
`

const StatusIcon = ({ color, title, viewport }) => (
  <Container viewport={viewport}>
    <Icon
      color={color}
      viewport={viewport}
      size={24}
    />
    <StyledText
      color={DARK_SKY_BLUE}
      fontSize={9}
    >
      {title}
    </StyledText>
  </Container>
)

export default connect(state => ({ viewport: state.viewport }))(StatusIcon)
