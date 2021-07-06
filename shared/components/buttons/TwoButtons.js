import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import styled from 'styled-components'

import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { WHITE, AQUA_MARINE, DARK, LIGHT_BLUE_GREY } from 'shared/constants/colors'
import { getWidth, getHeight } from 'shared/utils/dynamicSize'

const ButtonsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => getHeight(20, props.viewport)};
  ${props => props.customStyle}
`

const Buttons = (props) => {
  const { viewport, leftButtonTitle, rightButtonTitle,
    leftButtonOnPress, rightButtonOnPress, containerCustomStyle } = props
  return (
    <ButtonsContainer viewport={viewport} customStyle={containerCustomStyle}>
      <PrimaryButton
        title={leftButtonTitle}
        color={WHITE}
        customStyle={`
          flex: 1;
          margin-right: ${getWidth(5, viewport)};
          border-width: 1;
          border-color: ${LIGHT_BLUE_GREY}
        `}
        textCustomStyle={`
          color: ${DARK};
        `}
        textProps={{ bold: true }}
        onPress={leftButtonOnPress}
      />
      <PrimaryButton
        title={rightButtonTitle}
        color={AQUA_MARINE}
        customStyle={`
          flex: 1;
          margin-left: ${getWidth(5, viewport)}
        `}
        onPress={rightButtonOnPress}
      />
    </ButtonsContainer>
  )
}

Buttons.propTypes = {
  leftButtonTitle: 'More',
  rightButtonTitle: 'Next'
}


Buttons.propTypes = {
  viewport: PropTypes.object.isRequired,
  leftButtonTitle: PropTypes.string,
  rightButtonTitle: PropTypes.string,
  leftButtonOnPress: PropTypes.func,
  rightButtonOnPress: PropTypes.func,
  containerCustomStyle: PropTypes.string
}

export default Buttons