import { firebase } from '@firebase/app'
import { auth, ref } from 'constants/firebase'
import config from 'src/config'
import _ from 'lodash'
import store from 'model/store'
import * as roles from 'constants/roles'

export function signOut () {
  return async function () {
    try {
      if (auth.currentUser) {
        console.log('signOut')
        await auth.signOut()
      }
    } catch (e) {
      console.log('signOut error:', e.message)
    }
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

export async function signInWithEmailAndPassword (email, password) {
  try {
    console.log('signInByEmailPassword', email, password)
    const authData = await auth.signInWithEmailAndPassword(email, password)
    console.log('signInWithEmailAndPassword done', authData)
    return null
  } catch (e) {
    return e
  }
}

export async function sendPasswordResetEmail (email) {
  try {
    await auth.sendPasswordResetEmail(email)
    return null
  } catch (e) {
    return e
  }
}

function updateEmail (newEmail, onError, onSuccess) {
  return async function (dispatch, getState) {
    try {
      console.log('updateEmail')
      const user = auth.currentUser
      await user.updateEmail(newEmail)
      onSuccess()
    } catch (e) {
      console.log('updateEmail', e.message)
      onError(e)
    }
  }
}

export function updatePassword (newPassword, onError, onSuccess) {
  return async function (dispatch, getState) {
    try {
      console.log('updatePassword')
      const user = auth.currentUser
      await user.updatePassword(newPassword)
      onSuccess()
    } catch (e) {
      console.log('updatePassword', e)
      onError(e)
    }
  }
}

export function reauthenticate (email, password, onError, onSuccess) {
  return async function (dispatch, getState) {
    try {
      console.log('reauthenticate')
      const credential = firebase.auth.EmailAuthProvider.credential(email, password)
      await auth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
      console.log('User successfully reauthenticated. New ID tokens should be valid.')
      onSuccess()
    } catch (e) {
      console.log(e)
      onError(e)
    }
  }
}

export function updateCredentials (email, password, onError, onSuccess) {
  return async function (dispatch, getState) {
    try {
      console.log('updateCredentials')
      const user = auth.currentUser
      if (email !== user.email) {
        dispatch(updateEmail(email, onError, onSuccess))
      } else {
        dispatch(updatePassword(password, onError, onSuccess))
      }
    } catch (e) {
      console.log('updateCredentials', e.message)
      onError(e)
    }
  }
}

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
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

export async function fetchInviteInfo (infoId) {
  console.log('fetchInvoteInfo', infoId)
  const infoSN = await ref.child(`invites/${infoId}`).once('value')
  const info = infoSN.val()
  await ref.child(`invites/${infoId}`).set(null)
  return info
}

export async function changeRole (uid, newRole) {
  const state = store.getState()
  const accountId = _.get(state, 'user.currentAccountId')
  const isOwner = _.get(state, ['user', 'accounts', accountId, 'role']) === roles.OWNER
  if (isOwner) {
    await ref.child(`accounts/${accountId}/admins/${uid}/role`).set(newRole)
  } else {
    console.log('User is not an account owner')
  }
}

export async function deleteMember (uid) {
  const state = store.getState()
  const accountId = _.get(state, 'user.currentAccountId')
  const isOwner = _.get(state, ['user', 'accounts', accountId, 'role']) === roles.OWNER
  if (isOwner) {
    await ref.child(`accounts/${accountId}/admins/${uid}`).set(null)
  } else {
    console.log('User is not an account owner')
  }
}
