import React from 'react'
import { Select } from '@shopify/polaris'

import amountType from 'shared/constants/amountType'

const amountTypeOptions = [
  { label: '%', value: amountType.PERCENTAGE },
  { label: '$', value: amountType.FLAT_AMOUNT }
]

const PercOrFixedSelect = ({ value, onChange }) => {
  return (
    <Select
      label='Amount type'
      labelHidden
      options={amountTypeOptions}
      value={value}
      onChange={onChange}
    />
  )
}

export default PercOrFixedSelect
