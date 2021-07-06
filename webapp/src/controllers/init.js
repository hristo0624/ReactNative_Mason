import history from 'src/history'
import { auth, ref } from 'constants/firebase'
import { addListener, clearListeners, clearUserListener, setUserRef } from 'controllers/listeners'
import { setAuthorized } from 'utils/storage'
import { fetchReferences } from 'controllers/data'
import _ from 'lodash'
import { clear, logoutUser, receiveUser } from 'model/actions/userAC'
import store from 'model/store'
import * as roles from 'constants/roles'
import { receiveAccount } from 'model/actions/accountAC'
import { receiveLineItems } from 'model/actions/lineItemsAC'

let firstAuth = true
let companyName = ''

export function setCompanyName (name) {
  companyName = name
}

async function fetchAccount (user, accountId) {
  console.log('fetchAccount', accountId)
  const fieldPath = `accounts/${accountId}`
  const fieldRef = ref.child(fieldPath)
  addListener(fieldPath, fieldRef)
  fieldRef.on('value', async sn => {
    const account = sn.val() || {}
    store.dispatch(receiveAccount(account))
  })
}

async function fetchLineItems (accountId) {
  console.log('fetchLineItems', accountId)
  const fieldPath = `lineItems/${accountId}`
  const fieldRef = ref.child(fieldPath)
  addListener(fieldPath, fieldRef)
  fieldRef.on('value', async sn => {
    const lineItems = sn.val() || {}
    store.dispatch(receiveLineItems(lineItems))
  })
}

async function updateUserData (user) {
  console.log('updateUserData', user)
  const currentAccountId = _.get(user, 'currentAccountId')
  if (currentAccountId) {
    await fetchAccount(user, currentAccountId)
    await fetchLineItems(currentAccountId)
  } else {
    console.log('updateUserData: account is not created yet')
    const ac = {
      id: user.id,
      createdAt: _.now(),
      admins: {
        [user.id]: {
          id: user.id,
          role: roles.OWNER,
          email: _.get(user, 'profile.email', null),
          name: _.get(user, 'profile.name', auth.currentUser.displayName)
        }
      },
      company: {
        name: companyName
      }
    }
    console.log('updateUserData: create account')
    await ref.child(`accounts/${ac.id}`).set(ac)
    const userAccountsUpdate = {
      id: ac.id,
      role: roles.OWNER,
      companyName
    }
    console.log('updateUserData: set currentAccountId', ac.id)
    await ref.child(`users/${user.id}/currentAccountId`).set(ac.id)
    console.log('updateUserData: userAccountsUpdate', userAccountsUpdate)
    await ref.child(`users/${user.id}/accounts/${ac.id}`).update(userAccountsUpdate)
    const userName = auth.currentUser.displayName
    if (!_.has(user, 'name')) {
      ref.child(`users/${user.id}/profile/name`).set(userName)
    }
  }
}

async function init (user) {
  console.log('init user', user)
  store.dispatch(fetchReferences())
  updateUserData(user)
}

async function userChanged (user) {
  console.log('user changed', user)
  const state = store.getState()
  // check if account switched
  const currentAccountNow = _.get(state, 'user.currentAccountId')
  console.log('current account now', currentAccountNow, 'updated user current account', user.currentAccountId)
  if (currentAccountNow !== user.currentAccountId) {
    console.log('current account id changed', currentAccountNow !== user.currentAccountId)
    store.dispatch(clear())
    clearListeners()
    updateUserData(user)
  }
}

async function createDBUser (authData) {
  console.log('createDBUser, authData', authData)
  const newUser = {
    id: authData.uid,
    profile: {
      createdAt: authData.metadata.creationTime,
      email: _.get(authData, 'email', null),
      name: _.get(authData, 'displayName', null)
    }
  }
  console.log('createDBUser', newUser)
  await ref.child('users').child(authData.uid).set(newUser)
  store.dispatch(receiveUser(newUser))
}

async function fetchUser (authData) {
  const userId = authData.uid
  const fieldPath = `users/${userId}`
  const fieldRef = ref.child(fieldPath)
  setUserRef(fieldRef)
  fieldRef.on('value', async sn => {
    const user = sn.val()
    if (_.isNil(user)) {
      await createDBUser(authData)
    } else {
      if (firstAuth) {
        firstAuth = false
        await init(user)
      } else {
        await userChanged(user)
      }
      store.dispatch(receiveUser(user))
    }
  })
}

async function onAuthStateChanged (authData) {
  console.log('authData', authData, history.location)
  if (authData) {
    await fetchUser(authData)
    setAuthorized(true)
    if (history.location.pathname === '/signin' || history.location.pathname === '/signup') {
      history.push('/')
    } else {
      history.push(history.location.pathname)
    }
  } else {
    console.log('onAuthStateChanged authData null, history', history)
    clearListeners()
    clearUserListener()
    firstAuth = true
    console.log('pathname:', history.location.pathname)
    if (!_.startsWith(history.location.pathname, '/finishSignUp')) {
      console.log('redirect to auth')
      history.push('/signin')
    }
    setAuthorized(false)
    store.dispatch(logoutUser())
    setCompanyName('')
  }
}

export function appInitialized () {
  return async function (dispatch, getState) {
    try {
      console.log('appInitialized')
      auth.onAuthStateChanged(onAuthStateChanged)
    } catch (e) {
      console.log('app initialization error', e)
    }
  }
}
