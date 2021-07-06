import config from 'config'

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
    key: config.googleMapsApiKey
  }
  if (needComponents) paramsObj.components = 'country:us'
  const params = Object.keys(paramsObj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(paramsObj[k])}`).join('&')
  const url = `${api}/json?${params}`
  request.open('GET', url)
  request.send()
  return request
}

export const autocomplete = (input, onResult) => sendRequest('https://maps.googleapis.com/maps/api/place/autocomplete', { input }, onResult)
export const geocode = (address, onResult) => sendRequest('https://maps.googleapis.com/maps/api/geocode', { address }, onResult)
export const reverseGeocode = (lat, lng, onResult) => sendRequest('https://maps.googleapis.com/maps/api/geocode', { latlng: `${lat},${lng}` }, onResult, false)
export const reverseGeocodeByPlaceId = (placeId, onResult) => sendRequest('https://maps.googleapis.com/maps/api/geocode', { place_id: placeId }, onResult, false)

export async function reverseGeocodeAsync (lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.googleMapsApiKey}`
  const res = await (await fetch(url)).json()
  return res
}

export function geoDistance (p1, p2) {
  const R = 6371e3
  const φ1 = p1.latitude.toRadians()
  const φ2 = p2.latitude.toRadians()
  const Δφ = (p2.latitude - p1.latitude).toRadians()
  const Δλ = (p2.longitude - p1.longitude).toRadians()
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const res = R * c / 1000
  // console.log('getDistance', p1, p2, res)
  return res
}

export function getCity (results) {
  for (let ac = 0; ac < results[0].address_components.length; ac++) {
    const component = results[0].address_components[ac]
    if (component.types[0] === 'locality') {
      return component.long_name.toUpperCase()
    }
  }
  return ''
}
