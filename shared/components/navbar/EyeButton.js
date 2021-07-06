import React from 'react'
import { connect } from 'react-redux'
import EyeIcon from 'shared/icons/PrivateEye'
import HeaderButton, { ICON_SIZE } from 'shared/components/navbar/HeaderButton'
import { fontSize } from 'shared/utils/dynamicSize'

const Button = ({ viewport, color, ...rest }) => {
  const ButtonElement = <EyeIcon size={fontSize(ICON_SIZE, viewport)} />
  return (
    <HeaderButton
      title='eye'
      ButtonElement={ButtonElement}
      {...rest}
    />
  )
}

export default connect(state => ({ viewport: state.viewport }))(Button)
