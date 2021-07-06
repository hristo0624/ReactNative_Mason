import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Autocomplete } from '@shopify/polaris'

import * as googleAutocomplete from 'utils/googleAutocompleteService'

class AddressAutocomplete extends Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      selected: [],
      options: [],
      loading: false
    }
  }

  static getDerivedStateFromProps (props, prevState) {
    if (prevState.value !== props.value) {
      return {
        text: _.get(props, 'value.description', ''),
        selected: [],
        // options: [],
        loading: false,
        value: props.value
      }
    }
    return null
  }

  componentDidMount () {
    googleAutocomplete.init()
  }

  clearPredictions = () => this.setState({ options: [], selected: [] })

  onPredictionsReceived = (predictions, status) => {
    // console.log('onPredictionsReceived', predictions, status)
    this.setState({ loading: false })
    if (status !== googleAutocomplete.autocompleteOK) {
      console.warn('PlacesServiceStatus:', status)
      this.setState({
        options: [{
          value: null,
          label: `No results`,
          structured: null
        }],
        text: null,
        focused: true
      })
      return
    }
    // console.log(predictions)
    this.setState({
      options: predictions.map(s => ({
        value: s.place_id,
        label: s.description,
        structured: {
          main: _.get(s, 'structured_formatting.main_text', null),
          secondary: _.get(s, 'structured_formatting.secondary_text', null)
        }
      })),
      focused: true
    })
  }

  onChange = text => {
    // console.log('address autocompletion onChange', text)
    this.setState({ text })
    if (text && text !== '') {
      this.setState({ loading: true })
      googleAutocomplete.getPlacePredictions(text, this.onPredictionsReceived)
    } else {
      this.clearPredictions()
      this.props.onSelect(null)
    }
  }

  onDetailsReceived = addressInfo => {
    this.props.onSelect(addressInfo)
  }

  onSelect = async selected => {
    // console.log('onSelect', selected)
    const placeId = _.get(selected, 0)
    if (placeId) {
      const matchedOption = this.state.options.find((option) => {
        return option.value.match(placeId)
      })
      const selectedText = _.get(matchedOption, 'label')
      const structured = _.get(matchedOption, 'structured', null)
      // this.setState({ selected, text: selectedText })
      this.setState({
        selected,
        text: selectedText,
        description: selectedText,
        structured
      })
      // this.props.onSelect({ description: selectedText, placeId, structured })
      try {
        const res = await googleAutocomplete.getPlaceDetailsFormatted(placeId, structured)
        this.onDetailsReceived(res)
      } catch (e) {
        console.log('get details error', e)
      }
    }
  }

  onBlur = () => this.setState({ focused: false })

  render () {
    const { text, selected, options, loading, focused } = this.state
    const { label, error, onFocus } = this.props
    // console.log('Address autocomplete render, options', options, loading)
    return (
      <Autocomplete
        options={options}
        selected={selected}
        onSelect={this.onSelect}
        loading={loading}
        preferredPosition='below'
        textField={
          <Autocomplete.TextField
            onChange={this.onChange}
            label={label || 'Address'}
            value={text}
            name='address'
            error={error}
            onFocus={onFocus}
            autoComplete={false}
            focused={focused}
            onBlur={this.onBlur}
          />
        }
      />
    )
  }
}

AddressAutocomplete.propTypes = {
  value: PropTypes.shape({
    description: PropTypes.string,
    placeId: PropTypes.string
  }),
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
  error: PropTypes.any,
  onFocus: PropTypes.func
}

export default AddressAutocomplete
