import React from 'react'
import PropTypes from 'prop-types'

import ModalSelect from 'shared/components/modals/ModalSelect'

export const PROJECTS = 'Projects'
export const PROPOSALS = 'Proposals'

const ProjectsOrProposals = ({ visible, onClose, onSelect, value }) => {
  const items = [
    { id: PROJECTS, title: PROJECTS },
    { id: PROPOSALS, title: PROPOSALS }
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

ProjectsOrProposals.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

ProjectsOrProposals.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

export default ProjectsOrProposals
