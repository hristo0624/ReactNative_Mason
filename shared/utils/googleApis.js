/* globals XMLHttpRequest */
import config from 'config'
import _ from 'lodash'

const sendRequest = (api, query, onResult, needComponents = true) => {
  const request = new XMLHttpRequest()
  request.timeout = 5000
  request.onreadystatechange = () => {
    if (request.readyState !== 4) {
      return
    }
    if (request.status === 200) {
      const responseJSON = JSON.parse(request.responseText)
      onResult(responseJSON)
    }
  }
  request.onerror = (e) => {
    console.log('sendRequest error', e)
    onResult(null)
  }
  const paramsObj = {
    ...query,
    key: config.apiKey
  }
  if (needComponents) paramsObj.components = 'country:us' //components=country:us|country:pr|c
  const params = Object.keys(paramsObj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(paramsObj[k])}`).join('&')
  const url = `${api}/json?${params}`
  request.open('GET', url)
  request.send()
  return request
}

export const autocomplete = (input, sessiontoken, onResult) => {
  const options = {
    input,
    sessiontoken,
    components: 'country:us',
    types: 'address'
  }
  return sendRequest('https://maps.googleapis.com/maps/api/place/autocomplete', options, onResult)
}

export const getPlaceDetails = (placeid, onResult) => {
  const options = {
    placeid,
    fields: 'address_components,geometry,formatted_address,name'
  }
  return sendRequest('https://maps.googleapis.com/maps/api/place/details', options, onResult)
}

export const getPlaceDetailsFormatted = (placeId, structured = null) => new Promise((resolve, reject) => {
  getPlaceDetails(placeId, response => {
    const status = _.get(response, 'status')
    if (status === 'OK') {
      const details = _.get(response, 'result', {})
      // console.log('onDetails receives, details', details)
      const address = _.get(details, 'address_components', [])

      const res = {
        structured,
        description: _.get(details, 'formatted_address', null),
        location: _.get(details, 'geometry.location', null),
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
    } else {
      reject(new Error('google api error, status', status))
    }
  })
})

export const getCoordsByAddress = (address, onResult) => {
  const options = {
    address
  }
  return sendRequest('https://maps.googleapis.com/maps/api/geocode', options, onResult)
}


