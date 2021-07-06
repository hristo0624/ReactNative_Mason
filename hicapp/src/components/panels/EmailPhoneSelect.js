import React from 'react'
import PropTypes from 'prop-types'

import ModalSelect from 'shared/components/modals/ModalSelect'

const EmailPhoneSelect = ({ visible, onClose, onSelect, value }) => {
  const items = [
    { id: 'email', title: 'Email' },
    { id: 'phone', title: 'Phone number' }
  ]
  return (
    <ModalSelect
      visible={visible}
      onClose={onClose}
      onSelect={onSelect}
      selectedId={value}
      items={items}
    />
  )
}

EmailPhoneSelect.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

EmailPhoneSelect.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

export default EmailPhoneSelect
