import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { View } from 'react-native'

import { fontSize, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import Chevron from 'shared/components/Chevron'

import { LIGHT_NAVY } from 'shared/constants/colors'

const CustomText = styled(StyledText)`
  text-align: right;
  font-size: ${props => fontSize(14, props.viewport)};
  width: ${props => getWidth(150, props.viewport)};
  opacity: ${props => props.disabled ? 0.5 : 1};
`
const Container = styled(View)`
  flex-direction: row;
`

const TextWithChevron = ({ value, viewport, disabled, hideChevron, ...rest }) => (
  <Container>
    <CustomText
      viewport={viewport}
      numberOfLines={1}
      ellipsizeMode='tail'
      color={LIGHT_NAVY}
      regular
      disabled={disabled}
      {...rest}
    >
      {value}
    </CustomText>
    {hideChevron ? null : <Chevron name='chevron-right' disabled={disabled} />}
  </Container>
)

export default connect(state => ({ viewport: state.viewport }))(TextWithChevron)
