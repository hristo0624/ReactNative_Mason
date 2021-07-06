import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import MapView from 'react-native-maps'

import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE, NICE_BLUE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { getCoordsByAddress } from 'shared/utils/googleApis'

export const initialRegion = {
  latitude: 34.07584045476854, // 34.09445, // 34.0481928
  longitude: -118.37483419199219, /// -118.388328, // -118.4428069
  latitudeDelta: 0.002922,
  longitudeDelta: 0.002421
}

const MapContainer = styled.View`
  flex: 1;
`

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class MapModal extends Component {
  constructor (props) {
    super(props)
    // console.log('map modal constructor props', props)
    const latitude = _.get(props, 'location.lat')
    const longitude = _.get(props, 'location.lng')
    this.state = {
      region: {
        ...initialRegion
      }
    }
    if (latitude) _.set(this.state, 'region.latitude', latitude)
    if (longitude) _.set(this.state, 'region.longitude', longitude)
  }

  componentWillUnmount = () => {
    this.onGoogleApiResult = () => null
  }

  onMapViewMounted = (ref) => {
    // console.log('onMapViewMounted')
    if (ref && !this.mapViewRef) {
      this.mapViewRef = ref
      const location = _.get(this.props, 'location', {})
      if (_.isEmpty(location) && _.has(this.props, 'address')) {
        // console.log('get coords', this.props.address)
        getCoordsByAddress(this.props.address, this.onGoogleApiResult)
      }
    }
  }

  onGoogleApiResult = (res) => {
    // console.log('onGoogleApiResult', res)
    const location = _.get(res, [ 'results', 0, 'geometry', 'location' ])
    // console.log('onGoogleApiResult, location ', location)
    if (location && this.mapViewRef) {
      const region = {
        ...initialRegion,
        latitude: location.lat,
        longitude: location.lng
      }
      // console.log('animate to region', region)
      this.setState({
        region
      })
      this.mapViewRef.animateToRegion(region, 500)
    }
  }

  renderMap = () => {
    const { viewport } = this.props
    const { region } = this.state
    const mapContainerStyle = {
      width: viewport.width,
      height: '100%'
    }
    return (
      <MapView
        style={mapContainerStyle}
        minDelta={0.00002}
        maxDelta={1}
        initialRegion={region}
        showsUserLocation
        rotateEnabled={false}
        pitchEnabled={false}
        showsMyLocationButton={false}
        ref={this.onMapViewMounted}
      >
        <MapView.Marker
          pinColor={NICE_BLUE}
          coordinate={region}
        />
      </MapView>
    )
  }

  render () {
    const { viewport, visible, address, onClose } = this.props
    let title = address
    if (address.length > 23) title = `${address.substr(0, 20)}...`
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        title={'Choose role'}
        onClose={onClose}
        showCross={false}
        percHeight={0.85}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: title || 'Project location' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <MapContainer>
            {this.renderMap()}
          </MapContainer>
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

MapModal.defaultProps = {
  visible: false,
  onClose: () => null
}

MapModal.propTypes = {
  address: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  location: PropTypes.object
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(MapModal)
