import React from 'react'
import HeaderButton from './HeaderButton'
import NavigationService from 'shared/navigation/service'

const Button = ({ onPress, onPressHandler, ...rest }) => {
  const onClick = () => {
    if (onPressHandler) {
      onPressHandler()
    } else {
      if (onPress) onPress()
      NavigationService.goBack()
    }
  }
  return (
    <HeaderButton iconName='ios-arrow-back' onPress={onClick} {...rest} />
  )
}

export default Button
