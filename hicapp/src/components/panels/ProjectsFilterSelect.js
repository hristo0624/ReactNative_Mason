import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import ModalSelect from 'shared/components/modals/ModalSelect'

export const filters = {
  HIGHT_TO_LOW: 'High to Low',
  LOW_TO_HIGHT: 'Low to High',
  MOST_RECENT: 'Most recent',
  LEAST_RECENT: 'Least Recent',
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress'
}

const ProjectsFilterSelect = ({ visible, onClose, onSelect, value }) => {
  const items = _.map(filters, v => ({ id: v, title: v }))
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

ProjectsFilterSelect.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

ProjectsFilterSelect.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

export default ProjectsFilterSelect
