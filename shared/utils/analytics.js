import { Platform } from 'react-native'
import moment from 'moment-timezone'

import config from 'config'

const internalAppVersion = 1

const dummyAnalytics = {
  identify: () => null,
  people_set: () => null,
  track: () => null,
  people_union: () => null,
  people_append: () => null
}

export function formattedUTCTime (t) {
  const m = moment(t).tz('UTC')
  return m.format('YYYY-MM-DDTHH:mm:ss')
}

const analytics = dummyAnalytics

export function identify (userId) {
  analytics.identify(userId)
}

function keyByPropName (propName) {
  switch (propName) {
    case 'email': return '$email'
    case 'createdAt': return '$created'
    default: return propName
  }
}

export function setUser (user, accountId) {
  const userInfo = {}
  const params = {
    accountId,
    userId: user.id,
    email: user.email,
    createdAt: user.createdAt,
    internalAppVersion: internalAppVersion
  }
  for (const propName in params) {
    const prop = params[propName]
    if (prop) {
      userInfo[keyByPropName(propName)] = params[propName]
    }
  }
  analytics.people_set(userInfo)
}

export function setPushRegistrationId (token) {
  const k = Platform.OS === 'android' ? '$android_devices' : '$ios_devices'
  analytics.people_set({ [k]: [token] })
}

export function reset () {
  analytics.reset()
}

export function track (eventName, eventProps = {}) {
  analytics.track(eventName, eventProps)
}
