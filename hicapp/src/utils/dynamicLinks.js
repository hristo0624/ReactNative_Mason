import _ from 'lodash'
import Constants from 'expo-constants'

import { auth, firebaseLinks, DynamicLink } from 'constants/firebase'
import config from 'config'

const LINK = 'https://getfriday.co/ref/'

function makeUserLink () {
  const uid = auth.currentUser.uid
  return `${LINK}${uid}`
}

export async function createDynamicLink () {
  try {
    const link = new DynamicLink(
      makeUserLink(),
      config.dynamicLinkDomain
    )
    link.android.setPackageName(_.get(Constants, 'manifest.android.package'))
    link.ios.setAppStoreId(_.get(config, 'appleApplicationId'))
    link.ios.setBundleId(_.get(Constants, 'manifest.ios.bundleIdentifier'))
    const dynamicLink = await firebaseLinks.createDynamicLink(link)
    return dynamicLink
  } catch (e) {
    console.log('createDynamicLink error:', e.message)
    return null
  }
}

export async function createShareLink () {
  try {
    const firebaseEndPoint = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${config.apiKey}`
    /* const longDynamicLink = await createDynamicLink()
    const body = JSON.stringify({
      longDynamicLink,
      suffix: { option: 'SHORT' }
    }) */
    const body = JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: config.dynamicLinkDomain,
        link: makeUserLink(),
        androidInfo: {
          androidPackageName: _.get(Constants, 'manifest.android.package')
        },
        iosInfo: {
          iosBundleId: _.get(Constants, 'manifest.ios.bundleIdentifier'),
          iosAppStoreId: _.get(config, 'appleApplicationId')
        }
      },
      suffix: {
        option: 'SHORT'
      }
    })
    const request = {
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }
    const res = await fetch(firebaseEndPoint, request)
    const result = await res.json()
    return _.get(result, 'shortLink')
  } catch (e) {
    console.log('createShareLink error:', e.message)
  }
}

export function getReferrer (url) {
  if (!auth.currentUser) {
    console.log('user does not exists yet')
    const refUid = url.replace(LINK, '')
    return refUid
  }
  return null
}
