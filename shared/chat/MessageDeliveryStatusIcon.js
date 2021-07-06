import React from 'react'
import PropTypes from 'prop-types'
import Ionicons from '@expo/vector-icons/Ionicons'

import deliveryStatus from 'shared/constants/deliveryStatus'
import { AQUA_MARINE, BLUEY_GREY, LIGHT_NAVY, ICE_BLUE } from 'shared/constants/colors'

const MessageDeliveryStatusIcon = (props) => {
  const { status, size, subsApp } = props
  switch (status) {
    case deliveryStatus.SENT :
      return (
        <Ionicons
          name='ios-checkmark'
          size={size}
          color={subsApp ? ICE_BLUE : BLUEY_GREY}
        />
      )
    case deliveryStatus.DELIVERED :
      return (
        <Ionicons
          name='ios-done-all'
          size={size}
          color={subsApp ? ICE_BLUE : BLUEY_GREY}
        />
      )
    case deliveryStatus.READ :
      return (
        <Ionicons
          name='ios-done-all'
          size={size}
          color={subsApp ? LIGHT_NAVY : AQUA_MARINE}
        />
      )
    default: return null
  }
}

MessageDeliveryStatusIcon.defaultProps = {
  status: deliveryStatus.NEW,
  size: 20,
  subsApp: false
}

MessageDeliveryStatusIcon.propTypes = {
  status: PropTypes.string,
  size: PropTypes.number,
  subsApp: PropTypes.bool
}

export default MessageDeliveryStatusIcon

