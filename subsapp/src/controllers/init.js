import _ from 'lodash'

import navigationService from 'shared/navigation/service'
import { auth, ref } from 'constants/firebase'

import screens from 'constants/screens'
import store from 'model/store'
import { fetchReferences } from 'controllers/data'
import { addListener, clearListeners, setUserRef, clearUserListener, hasListener } from 'controllers/listeners'
import { logoutUser, receiveUser } from 'model/actions/userAC'
import { receiveMessages } from 'model/actions/messagesAC'
import { updatedDeliveryStatusForNewMessage } from 'controllers/chat'
import { receiveTyping } from 'model/actions/typingAC'
import { receiveUnread } from 'model/actions/unreadAC'
import { receiveReadBy } from 'model/actions/readbyAC'

let firstAuth = true

async function createDBUser (authData) {
  console.log('createDBUser, authData', authData)
  const newUser = {
    id: authData.uid,
    isSub: true,
    appInstalled: true,
    createdAt: _.now()
  }
  console.log('createDBUser', newUser)
  await ref.child('users').child(authData.uid).update(newUser)
  store.dispatch(receiveUser(newUser))
}

async function init () {
  console.log('init')
  store.dispatch(fetchReferences())
}

function updateLastMessagesListeners (userId, projects = {}) {
  for (const projectId in projects) {
    const messagesPath = `channels/${projectId}/${userId}/messages`
    const r = ref.child(messagesPath)
    if (!hasListener(messagesPath)) {
      r.orderByChild('timestamp').limitToLast(1).on('value', sn => {
        const messages = sn.val()
        console.log('receive messages', messages, projectId)
        updatedDeliveryStatusForNewMessage(messages, projectId)
        store.dispatch(receiveMessages(messages, projectId))
      })
      console.log('-----> add messages path to listeners', messagesPath)
      addListener(messagesPath, r)
    }

    const typingPath = `channels/${projectId}/${userId}/typing`
      const rTyping = ref.child(typingPath)
      if (!hasListener(typingPath)) {
        rTyping.on('value', sn => {
          const typing = sn.val()
          console.log('receive typing', typing, projectId)
          store.dispatch(receiveTyping(typing, projectId))
        })
        addListener(typingPath, rTyping)
      }

    // Unread
    const unreadPath = `channels/${projectId}/${userId}/unread`
    const rUnread = ref.child(unreadPath)
    if (!hasListener(unreadPath)) {
      rUnread.on('value', sn => {
        const unread = sn.val()
        console.log('receive unread', unread, projectId)
        store.dispatch(receiveUnread(unread, projectId))
      })
      addListener(unreadPath, rUnread)
    }

    // ReadBy
    const readByPath = `channels/${projectId}/${userId}/readBy`
    const rReadBy = ref.child(readByPath)
    if (!hasListener(readByPath)) {
      rReadBy.on('value', sn => {
        const readBy = sn.val()
        console.log('receive readBy', readBy, projectId)
        store.dispatch(receiveReadBy(readBy, projectId))
      })
      addListener(readByPath, rReadBy)
    }
  }
}


async function fetchUser (authData) {
  try {
    console.log('fetchUser', authData.uid)
    const userId = authData.uid
    const fieldPath = `users/${userId}`
    const fieldRef = ref.child(fieldPath)
    setUserRef(fieldRef)
    console.log('fetch user path', fieldPath)
    const userSN = await ref.child(fieldPath).once('value')
    console.log('user received manually', userSN.val())
    fieldRef.on('value', async sn => {
      const user = sn.val()
      console.log('received user update from DB, id:', _.get(user, 'id', 'undefined'))
      if (!_.has(user, 'id')) {
        await createDBUser(authData)
      } else {
        if (firstAuth) {
          firstAuth = false
          await init(user)
        } else {
          // await userChanged(user)
        }
        store.dispatch(receiveUser(user))
        updateLastMessagesListeners(userId, _.get(user, 'projects', {}))
      }
    })
  } catch (e) {
    console.log('fetch user error', e)
  }
}


async function onAuthStateChanged (authData) {
  console.log('authData', authData)
  if (authData) {
    await fetchUser(authData)
    navigationService.navigate(screens.VERIFY_SUBCONTRACTOR)
  } else {
    console.log('onAuthStateChanged authData null')
    clearListeners()
    clearUserListener()
    firstAuth = true
    navigationService.navigate(screens.AUTH)
    store.dispatch(logoutUser())
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
