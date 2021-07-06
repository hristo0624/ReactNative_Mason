import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Ionicons from '@expo/vector-icons/Ionicons'
import HeaderButtons, {
  HeaderButton,
  Item
} from 'react-navigation-header-buttons'

import { NAVBAR_FONT, DUSK, BROWN_GREY } from 'shared/constants/colors'
import { DEFAULT_FONT } from 'constants/index'
import { fontSize } from 'shared/utils/dynamicSize'

const IconContainer = styled.View`
  margin-left: ${props => fontSize(7, props.viewport)};
  margin-right: ${props => fontSize(7, props.viewport)};
`

const FONT_SIZE = 20
export const ICON_SIZE = 24

const headerButtonComponent = iconComponent => ({ viewport, ...passMeFurther }) => (
  <HeaderButton {...passMeFurther} IconComponent={iconComponent || Ionicons} />
)

export const Buttons = ({ items }) => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    {items.map(({ title, iconName, color, onPress }) => (
      <Item
        key={title || iconName}
        title={title || iconName}
        iconName={iconName}
        color={color || NAVBAR_FONT}
        onPress={onPress}
      />
    ))}
  </HeaderButtons>
)

const Button = ({ title, iconName, onPress, color, viewport, disabled, dark, iconComponent, ButtonElement }) => {
  const btnElement = ButtonElement ? <IconContainer viewport={viewport}>{ButtonElement}</IconContainer> : null
  return (
    <HeaderButtons HeaderButtonComponent={headerButtonComponent(iconComponent)}>
      <Item
        key={title}
        title={title || iconName}
        iconName={iconName}
        color={disabled ? BROWN_GREY : dark ? DUSK : color}
        onPress={disabled ? undefined : onPress}
        buttonStyle={{
          fontFamily: DEFAULT_FONT,
          fontSize: fontSize(title ? FONT_SIZE : ICON_SIZE, viewport)
        }}
        ButtonElement={btnElement}
      />
    </HeaderButtons>
  )
      }

Button.defaultProps = {
  onPress: () => {},
  color: NAVBAR_FONT,
  disabled: false
}

Button.propTypes = {
  title: PropTypes.string,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  dark: PropTypes.bool
}

export default connect(state => ({ viewport: state.viewport }))(Button)
