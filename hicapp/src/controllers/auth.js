import _ from 'lodash'
import { auth } from 'constants/firebase'
import { trackEvent, category } from 'utils/analytics'
import config from 'config'
import headers from 'shared/controllers/headers'

export async function signOut () {
  try {
    if (auth.currentUser) {
      trackEvent('account_logout', category.ACCOUNT, 'presses logout button from open side menu')
      // Intercom.logout()
      // NavigationService.navigate(screens.LOADING)
      await auth.signOut()
      // Sentry.setUserContext()
    }
  } catch (e) {
    console.log('signOut error:', e.message)
  }
}

export async function signUpWithEmailAndPassword (email, password, userName) {
  try {
    console.log('signUpWithEmailAndPassword', email, password)
    await auth.createUserWithEmailAndPassword(email, password)
    const user = auth.currentUser
    console.log('auth user', user)
    await user.updateProfile({ displayName: userName })
    console.log('user profile updated')
    return null
  } catch (e) {
    return (e)
  }
}

export function signInWithEmailAndPassword (email, password, onError, onSuccess) {
  return async function (dispatch, getState) {
    try {
      console.log('signInByEmailPassword', email, password)
      const authData = await auth.signInWithEmailAndPassword(email, password)
      console.log('signInWithEmailAndPassword done', authData)
      onSuccess()
    } catch (e) {
      onError(e)
    }
  }
}

export function sendPasswordResetEmail (email, onSuccess, onError) {
  return async function (dispatch, getState) {
    try {
      await auth.sendPasswordResetEmail(email)
      onSuccess()
    } catch (e) {
      console.log(e)
      onError(e)
    }
  }
}

export function sendInvite (email, role) {
  return async function (dispatch, getState) {
    try {
      const currentUser = auth.currentUser
      const state = getState()
      const accountId = _.get(state, 'user.currentAccountId')
      if (accountId) {
        const authToken = await currentUser.getIdToken()
        const body = {
          authToken,
          email,
          role,
          accountId,
          mode: process.env.NODE_ENV,
          inviteFromEmail: currentUser.email,
          companyName: _.get(state, 'account.company.name', '')
        }
        console.log('sendInvite, body', body)
        const url = `${config.dynamicUrl}/proto/inviteMember`
        console.log('post to url ', url, 'body', body)
        const response = await fetch(url,
          {
            method: 'post',
            headers: headers,
            body: JSON.stringify(body)
          }
        )
        const answer = await response.json()
        console.log('sendInvite answer', answer)
      } else {
        console.log('current account is not set')
      }
    } catch (e) {
      console.log('sendInvite e:', e.message)
    }
  }
}

export async function sendRequest (url, searchParams) {
  try {
    const currentUser = auth.currentUser
    const authToken = await currentUser.getIdToken()
    const body = {
      authToken,
      searchParams
    }
    const response = await fetch(url,
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify(body)
      }
    )
    return await response.json()
  } catch (e) {
    console.log('sendInvite e:', e.message)
  }
}
