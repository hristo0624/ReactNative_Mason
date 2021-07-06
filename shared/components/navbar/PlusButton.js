import React from 'react'
import { connect } from 'react-redux'
import PlusIcon from 'shared/icons/Plus'
import HeaderButton, { ICON_SIZE } from 'shared/components/navbar/HeaderButton'
import { fontSize } from 'shared/utils/dynamicSize'

const Button = ({ viewport, color, ...rest }) => {
  const ButtonElement = <PlusIcon size={fontSize(ICON_SIZE, viewport)} color={color} />
  return (
    <HeaderButton
      title='plus'
      ButtonElement={ButtonElement}
      {...rest}
    />
  )
}

export default connect(state => ({ viewport: state.viewport }))(Button)
