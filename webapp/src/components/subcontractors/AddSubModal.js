import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal
} from '@shopify/polaris'
import SubcontractorsList from './SubcontractorsList'

class AddSubModal extends Component {
  render () {
    const { title, items, visible, onChange, onClose, onAction } = this.props
    return (
      <Modal
        open={visible}
        onClose={onClose}
        title={title}
        primaryAction={{ content: 'Add Sub', disabled: !items.length, onAction }}
        secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      >
        <Modal.Section>
          <SubcontractorsList
            label='Search subcontractors by name or business name'
            items={items}
            onChange={onChange}
          />
        </Modal.Section>
      </Modal>
    )
  }
}

AddSubModal.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array.isRequired,
  visible: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired
}

export default AddSubModal
