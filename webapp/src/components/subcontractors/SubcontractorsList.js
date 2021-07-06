import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ResourceList,
  TextStyle,
  Avatar,
  TextField,
  Modal
} from '@shopify/polaris'
import _ from 'lodash'

import SubcontractorsAutocomplete from './SubcontractorsAutocomplete'

class SubcontractorsList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedItems: [],
      confirmationModalVisible: false,
      phone: null
    }
  }

  showConfirmationModal = () => {
    this.setState({ confirmationModalVisible: true })
  }

  hideConfirmationModal = () => {
    this.setState({ confirmationModalVisible: false })
  }

  handleChangePhone = phone => this.setState({ phone })

  handleSelectionChange = selectedItems => {
    this.setState({ selectedItems })
  }

  onAddSub = (selected) => {
    if (selected) {
      const { items, onChange } = this.props
      const newItem = {
        id: _.get(selected, 'value'),
        name: _.get(selected, 'label')
      }
      onChange([
        ...items,
        newItem
      ])
    }
  }

  onAddSubPrompt = (subcontractor) => {
    this.setState({ subcontractor, phone: null })
    this.showConfirmationModal()
  }

  onAddNewSub = () => {
    const { phone, subcontractor } = this.state
    // TODO: create sub in db and send him invite
    console.log('phone', phone, subcontractor)
    this.onAddSub(subcontractor)
    this.hideConfirmationModal()
  }

  renderItem = item => {
    const { id, url, name, location } = item
    const media = <Avatar customer size='medium' name={name} />

    return (
      <ResourceList.Item
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
      >
        <h3>
          <TextStyle variation='strong'>{name}</TextStyle>
        </h3>
        <div>{location}</div>
      </ResourceList.Item>
    )
  }

  renderConfirmationModal = () => {
    const { confirmationModalVisible, phone } = this.state
    return (
      <Modal
        open={confirmationModalVisible}
        onClose={this.hideConfirmationModal}
        title={'Add new subcontractor'}
        primaryAction={{ content: 'Add', disabled: !phone, onAction: this.onAddNewSub }}
        secondaryActions={[{ content: 'Cancel', onAction: this.hideConfirmationModal }]}
      >
        <Modal.Section>
          <TextField
            label='Contact phone number'
            helpText="We'll send a link via SMS to this number"
            value={phone}
            onChange={this.handleChangePhone}
            type='tel'
          />
        </Modal.Section>
      </Modal>
    )
  }

  render () {
    const { items, label } = this.props
    const resourceName = {
      singular: 'subcontractor',
      plural: 'subcontractors'
    }
    return (
      <React.Fragment>
        <SubcontractorsAutocomplete
          label={label}
          onSelect={this.onAddSub}
          onAdd={this.onAddSubPrompt}
        />
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={this.renderItem}
          selectedItems={this.state.selectedItems}
          onSelectionChange={this.handleSelectionChange}
        />
        {this.renderConfirmationModal()}
      </React.Fragment>
    )
  }
}
SubcontractorsList.propsTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string
}

export default SubcontractorsList
