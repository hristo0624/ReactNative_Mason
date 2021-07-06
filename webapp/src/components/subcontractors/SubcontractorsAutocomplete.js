import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Autocomplete, Icon } from '@shopify/polaris'
import _ from 'lodash'
import generate from 'firebase-auto-ids'

class SubcontractorsAutocomplete extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: [],
      inputText: '',
      options: this.options,
      confirmationModalVisible: false
    }
  }

  options = [
    { value: 'ruslanId', label: 'Ruslan Electrical' },
    { value: 'russelId', label: 'Russell Noboa' },
    { value: 'rusticId', label: 'Rustic Carpentry Inc' },
    { value: 'martyId', label: 'Marti Valencia' },
    { value: 'saraId', label: 'Sara Scholz' }
  ]

  updateText = newValue => {
    this.setState({ inputText: newValue })
    this.filterAndUpdateOptions(newValue)
  }

  filterAndUpdateOptions = inputString => {
    if (inputString === '') {
      this.setState({
        options: this.options
      })
      return
    }

    const filterRegex = new RegExp(inputString, 'i')
    const resultOptions = this.options.filter(option =>
      option.label.match(filterRegex)
    )
    const addOption = {
      value: generate(_.now()),
      inputString,
      isNew: true,
      label: `Add "${inputString}"`
    }

    this.setState({
      options: [addOption, ...resultOptions]
    })
  }

  updateSelection = selected => {
    const selectedOptions = selected.map((selectedItem) => {
      const matchedOption = this.state.options.find((option) => {
        return option.value.match(selectedItem)
      })
      if (matchedOption && matchedOption.isNew) {
        return { value: selectedItem, label: matchedOption.inputString, isNew: true }
      }
      return matchedOption && ({ value: selectedItem, label: matchedOption.label })
    })

    const selectedOption = _.get(selectedOptions, 0)
    if (selectedOption) {
      if (selectedOption.isNew) {
        this.props.onAdd(selectedOption)
        const selected = _.get(selectedOption, 'value')
        const inputText = _.get(selectedOption, 'label')
        this.setState({ selected, inputText })
      } else {
        this.props.onSelect(selectedOption)
        this.setState({ selected: [], inputText: '' })
      }
    }
  }

  render () {
    const { label, onFocus } = this.props
    const { inputText, options, selected } = this.state
    const textField = (
      <Autocomplete.TextField
        onChange={this.updateText}
        label={label}
        value={inputText}
        prefix={<Icon source='search' color='inkLighter' />}
        placeholder='Search'
        onFocus={onFocus}
      />
    )
    return (
      <Autocomplete
        options={options}
        selected={selected}
        onSelect={this.updateSelection}
        textField={textField}
      />
    )
  }
}

SubcontractorsAutocomplete.propTypes = {
  label: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onFocus: PropTypes.func
}

export default SubcontractorsAutocomplete
