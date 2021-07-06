import { Facebook, Google } from 'expo'
import { Alert } from 'react-native'

import config from 'config'
import { isIos, isExpo } from 'constants/index'
import { signInWithProvider } from 'controllers/auth'
import { GOOGLE, FACEBOOK } from 'constants/authProviders'

function showAlert ({ title, message }) {
  Alert.alert(title, message, [
    {
      text: 'Ok',
      onPress: () => null
    }
  ])
}

function * signInWithFacebookAsync () {
  const { type, token } = yield Facebook.logInWithReadPermissionsAsync(
    config.facebookAppId,
    { permissions: ['public_profile', 'email'] }
  )
  return { type, data: { token } }
}

function * signInWithGoogleAsync () {
  const {
    androidClientId,
    iosClientId,
    androidStandaloneAppClientId,
    iosStandaloneAppClientId
  } = config
  let clientId
  if (isExpo) {
    clientId = isIos ? iosClientId : androidClientId
  } else {
    clientId = isIos ? iosStandaloneAppClientId : androidStandaloneAppClientId
  }
  const { type, accessToken, idToken } = yield Google.logInAsync({
    scopes: ['profile', 'email'],
    clientId,
    behavior: 'web' // Constants.appOwnership === 'expo' ? 'web' : 'system'
  })
  return { type, data: { accessToken, idToken } }
}

export function signInWith (provider, onComplete) {
  return function * (dispatch, getState) {
    try {
      let result
      switch (provider) {
        case FACEBOOK:
          result = yield signInWithFacebookAsync()
          break
        case GOOGLE:
          result = yield signInWithGoogleAsync()
          break
        default:
          console.log('Unknown provider', provider)
          return
      }
      const { type, data } = result
      console.log('type, data', type, data)
      if (type === 'success') {
        dispatch(signInWithProvider(provider, data))
      } else {
        showAlert({ title: 'Authentication cancelled' })
        onComplete()
      }
    } catch (e) {
      showAlert({ title: 'Authentication error', message: e.message })
      onComplete()
    }
  }
}
