import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import uuidv4 from 'uuid/v4'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import * as googleApis from 'shared/utils/googleApis'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import { getHeight } from 'shared/utils/dynamicSize'

const MAX_LENGTH = 100
const MIN_SEARCH_LENGTH = 2

@withMappedNavigationParams()
class ProjectAddress extends Component {
  constructor (props) {
    super(props)
    const address = _.get(props, 'address', {})
    this.state = {
      addressString: _.get(props, 'address.description'),
      addressOptions: [],
      sessionToken: uuidv4(),
      appointment: _.get(props, 'appointment'),
      ...address
    }
    this.searchingRequests = []
    this.search = _.debounce(this.search, 500)
  }

  save = () => {
    console.log('save')
    const { description, structured, placeId, city, county, state, zipcode, appointment, location, name } = this.state
    const { save } = this.props
    save({
      address: { description, structured, placeId, city, county, state, zipcode, location, name },
      appointment
    })
    navigationService.goBack()
  }

  componentWillUnmount () {
    this.abortSearchingRequests()
    this.onDetailsReceived = () => null
  }

  abortSearchingRequests = () => {
    this.searchingRequests.forEach((request) => {
      request.abort()
    })
    this.searchingRequests = []
  }

  updateSearchResults = searchResults => {
    const { viewport } = this.props
    const sections = searchResults.map((item, index) => ({
      key: index,
      desc: this.getTextForSearchResult(item),
      onPress: this.onPressSearchResult(item),
      containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
    }))
    this.setState({ addressOptions: sections })
  }

  onDetailsReceived = addressInfo => {
    this.setState({
      ...addressInfo,
      addressString: addressInfo.description,
      addressOptions: []
    })
  }

  onPressSearchResult = (item) => async () => {
    console.log('onPressSearchResult', item)
    const placeId = item.place_id
    const structured = {
      main: _.get(item, 'structured_formatting.main_text', null),
      secondary: _.get(item, 'structured_formatting.secondary_text', null)
    }
    try {
      const res = await googleApis.getPlaceDetailsFormatted(placeId, structured)
      this.onDetailsReceived(res)
    } catch (e) {
      console.log('get details error', e)
    }
  }

  getTextForSearchResult = searchResult => (
    searchResult.description || searchResult.formatted_address || searchResult.name
  )

  search = (text) => {
    const { sessionToken } = this.state
    if (text.length >= MIN_SEARCH_LENGTH) {
      this.abortSearchingRequests()
      const request = googleApis.autocomplete(text, sessionToken, responseJSON => {
        const results = _.get(responseJSON, 'predictions', [])
        if (results.length > 0) {
          this.updateSearchResults(results)
        }
      })
      this.searchingRequests.push(request)
    } else {
      this.updateSearchResults([])
    }
  }

  handleChange = (v) => {
    this.setState({
      addressString: v.substring(0, MAX_LENGTH)
    })
    this.search(v)
  }

  renderAddressInput = () => {
    const { addressString } = this.state
    return (
      <SectionItemInput
        value={addressString}
        onChange={this.handleChange}
        placeholder='Street'
        customStyle={`width: 100%; text-align: left;`}
        focused
      />
    )
  }

  handleAppointmentChange = (v) => {
    this.setState({ appointment: v })
  }

  renderAppointmentInput = () => {
    const { appointment } = this.state
    return (
      <SectionItemInput
        value={appointment}
        onChange={this.handleAppointmentChange}
        placeholder='Apt. 1'
        customStyle={`width: 100%; text-align: left;`}
      />
    )
  }

  renderContent = () => {
    const { addressOptions } = this.state
    return (
      <SectionList
        sections={[
          {
            title: 'STREET',
            data: [
              {
                key: 'street',
                customContent: this.renderAddressInput()
              },
              ...addressOptions
            ]
          },
          {
            title: 'Apt, suite, etc. (optional)',
            data: [
              {
                key: 'street',
                customContent: this.renderAppointmentInput()
              }
            ]
          }
        ]}
      />
    )
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: 'Project address' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          }}
        />
        {this.renderContent()}
      </Page>
    )
  }
}

ProjectAddress.propTypes = {
  address: PropTypes.object,
  save: PropTypes.func,
  appointment: PropTypes.string
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ProjectAddress)
