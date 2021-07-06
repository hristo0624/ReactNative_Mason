import _ from 'lodash'
let autocompleteService, placesService, sessionToken

export let autocompleteOK

const createSessionToken = () => new window.google.maps.places.AutocompleteSessionToken()

export const init = () => {
  if (!window.google) {
    throw new Error('Google Maps JavaScript API library must be loaded.')
  }

  if (!window.google.maps.places) {
    throw new Error(
      'Google Maps Places library must be loaded. Please add `libraries=places` to the src URL.'
    )
  }

  autocompleteService = new window.google.maps.places.AutocompleteService()
  placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
  sessionToken = createSessionToken()
  autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK
}

export const getPlacePredictions = (input, onResult) => {
  if (autocompleteService) {
    autocompleteService.getPlacePredictions(
      {
        input,
        sessionToken,
        componentRestrictions: {
          country: 'us'
        },
        types: ['address']
      },
      onResult
    )
  } else {
    throw new Error('Google Autocomplete Service was not initialized')
  }
}

export const getPlaceDetails = (placeId, onResult) => {
  if (placesService) {
    placesService.getDetails(
      {
        placeId,
        sessionToken,
        fields: ['address_components', 'geometry', 'formatted_address', 'name']
      },
      onResult
    )
    // session is a series of AutocompleteService.getPlacePredictions calls followed by a single PlacesService.getDetails call.
    sessionToken = createSessionToken()
  } else {
    throw new Error('Google Places Service was not initialized')
  }
}

export const getPlaceDetailsFormatted = (placeId, structured = null) => new Promise((resolve, reject) => {
  getPlaceDetails(placeId, details => {
    // console.log('onDetails receives, details', details)
    const address = _.get(details, 'address_components', [])

    const latF = _.get(details, 'geometry.location.lat', () => null)
    const lngF = _.get(details, 'geometry.location.lng', () => null)

    const res = {
      structured,
      description: _.get(details, 'formatted_address', null),
      location: {
        lat: latF(),
        lng: lngF()
      },
      name: _.get(details, 'name', null)
    }

    for (const component of address) {
      const t = _.get(component, ['types', 0])
      switch (t) {
        case 'locality':
          _.set(res, 'city', _.get(component, 'long_name'))
          break
        case 'administrative_area_level_2':
          _.set(res, 'county', _.get(component, 'long_name'))
          break
        case 'administrative_area_level_1':
          _.set(res, 'state', _.get(component, 'long_name'))
          _.set(res, 'stateAbbr', _.get(component, 'short_name'))
          break
        case 'postal_code':
          _.set(res, 'zipcode', _.get(component, 'long_name'))
          break
      }
    }
    resolve(res)
  })
})
