// import firebase from 'react-native-firebase'
import { Platform } from 'react-native'
// import appsFlyer from 'react-native-appsflyer'
// import _ from 'lodash'
// import Intercom from 'react-native-intercom'
import { auth } from 'constants/firebase'

// import config from 'config'

export const internalAppVersion = 0

// const firebaseAnalytics = firebase.analytics()

// const appsFlyerOptions = {
//   devKey: config.appsFlyerDevKey,
//   isDebug: config.appsFlyerIsDebug
// }

// if (Platform.OS === 'ios') {
//   appsFlyerOptions.appId = config.appleApplicationId
// } else if (Platform.OS === 'android') {
//   appsFlyerOptions.devKey = config.appsFlyerDevKeyAndroid
// }

// appsFlyer.initSdk(appsFlyerOptions,
//   (result) => {
//     console.log('appsFlyer init:', result)
//   },
//   (error) => {
//     console.warn('appsFlyer init:', error)
//   }
// )

// firebaseAnalytics.setAnalyticsCollectionEnabled(true)

export function trackScreen (screenName) {
  console.log('analitycs: track screen', screenName)
  // firebaseAnalytics.setCurrentScreen(screenName)
  // appsFlyer.trackEvent('Screen view', { screenName })
  // Intercom.logEvent('Screen view', { screenName })
}

export function trackUserId (userId) {
  console.log('analitycs: track userId', userId)
  // Intercom.registerIdentifiedUser({ userId: userId })
  // firebaseAnalytics.setUserId(userId)
  // appsFlyer.setCustomerUserId(userId, res => console.log('AppsFlyer trackUserId res:', res))
}

export function trackUserParams (user) {
  trackUserId(user.id)
  const params = {
    internal_app_version: internalAppVersion.toString(),
  }
  // firebaseAnalytics.setUserProperties(params)

  const authUser = auth.currentUser
  console.log('authUser metadata', authUser.metadata)
  // Intercom.updateUser({
  //   email: user.email,
  //   user_id: user.id,
  //   name: `${_.get(user, 'firstName', '')} ${_.get(user, 'lastName', '')}`,
  //   phone: _.get(user, 'phone', ''),
  //   signed_up_at: _.get(authUser, 'metadata.creationTime', 0) / 1000,
  //   // unsubscribed_from_emails: true,
  //   custom_attributes: {
  //     ...params
  //   }
  // })
}

// export function trackUserName (firstName, lastName) {
//   const params = {
//     name: `${firstName} ${lastName}`
//   }
//   firebaseAnalytics.setUserProperties(params)
// }

export function trackAppLaunch () {
  if (Platform.OS === 'ios') {
    // appsFlyer.trackAppLaunch()
  }
}

export function trackEvent (action, category, description = '', label = '', value = '') {
  const params = {
    category,
    label,
    description,
    value
  }
  console.log('analytics: track event, action', action, 'params', params)
  // firebaseAnalytics.logEvent(action, params)
  // appsFlyer.trackEvent(action, params)
  // Intercom.logEvent(action, params)
}

export function trackDeepLinkUrl (url) {
  // if (appsFlyer && Platform.OS === 'android') {
  //   appsFlyer.sendDeepLinkData(url) // Report Deep Link to AppsFlyer
  // }
}

export function enableUninstallTracking () {
  // if (appsFlyer && Platform.OS === 'android') {
  //   const gcmSenderId = '842417413033'
  //   appsFlyer.enableUninstallTracking(gcmSenderId, success => {
  //     console.log('track uninstall')
  //   })
  // }
}

export const category = {
  ONBOARD: 'onboard',
  CASHOUT: 'cashout',
  ACCOUNT: 'account'
}
