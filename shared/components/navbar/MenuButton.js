import React from 'react'
import HeaderButton from './HeaderButton'
import NavigationService from 'shared/navigation/service'
import { LIGHT_NAVY } from 'constants/colors'

const Button = (props) => (
  <HeaderButton
    iconName='md-menu'
    onPress={NavigationService.toggleDrawer}
    color={LIGHT_NAVY}
    {...props}
  />
)

export default Button
