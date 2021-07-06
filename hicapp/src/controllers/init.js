import { auth, ref } from 'constants/firebase'
import { addListener, clearListeners, setUserRef, clearUserListener, hasListener, offListener } from 'controllers/listeners'
import { fetchReferences } from 'controllers/data'
import _ from 'lodash'
import { logoutUser, receiveUser, clear } from 'model/actions/userAC'
import store from 'model/store'
import * as roles from 'constants/roles'
import {
  receiveAccountAdmins,
  receiveAccountCompany,
  receiveAccountContacts,
  receiveAccountCreatedAt,
  receiveAccountId,
  receiveAccountProjectsInfo,
  receiveAccountProposalsInfo,
  receiveAccountRoles
} from 'model/actions/accountAC'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import { receiveWorkOrders } from 'model/actions/workOrdersAC'
import { receiveMessages } from 'model/actions/messagesAC'
import { receiveTyping } from 'model/actions/typingAC'
import { updatedDeliveryStatusForNewMessage } from 'controllers/chat'
import { receiveUnread } from 'model/actions/unreadAC'
import { receiveReadBy } from 'model/actions/readbyAC'
import { getViewAllProjectPermission } from 'model/selectors/permissionsSelector'

let firstAuth = true
let companyName = ''

export function setCompanyName (name) {
  companyName = name
}

/* async function fetchAccount (user, accountId) {
  console.log('fetchAccount', accountId)
  const fieldPath = `accounts/${accountId}`
  const fieldRef = ref.child(fieldPath)
  addListener(fieldPath, fieldRef)
  fieldRef.on('value', async sn => {
    const account = sn.val() || {}
    store.dispatch(receiveAccount(account))
  })
} */

async function fetchAccountDetail (user, accountId) {
  const accountPath = `accounts/${accountId}`
  const adminsPath = `${accountPath}/admins`
  const companyPath = `${accountPath}/company`
  const contactsPath = `${accountPath}/contacts`
  const createdAtPath = `${accountPath}/createdAt`
  const projectsInfoPath = `${accountPath}/projectsInfo`
  const proposalsInfoPath = `${accountPath}/proposalsInfo`
  const rolesPath = `${accountPath}/roles`

  store.dispatch(receiveAccountId(accountId))

  // admins
  const adminsRef = ref.child(adminsPath)
  if (!hasListener(adminsPath)) {
    await adminsRef.on('value', sn => store.dispatch(receiveAccountAdmins(sn.val())))
    addListener(adminsPath, adminsRef)
  }

  const companyRef = ref.child(companyPath)
  if (!hasListener(companyPath)) {
    await companyRef.on('value', sn => store.dispatch(receiveAccountCompany(sn.val())))
    addListener(companyPath, companyRef)
  }

  const contactsRef = ref.child(contactsPath)
  if (!hasListener(contactsPath)) {
    await contactsRef.on('value', sn => store.dispatch(receiveAccountContacts(sn.val())))
    addListener(contactsPath, contactsRef)
  }

  const createdAtRef = ref.child(createdAtPath)
  if (!hasListener(createdAtPath)) {
    await createdAtRef.on('value', sn => store.dispatch(receiveAccountCreatedAt(sn.val())))
    addListener(createdAtPath, contactsRef)
  }

  const rolesRef = ref.child(rolesPath)
  if (!hasListener(rolesPath)) {
    await rolesRef.on('value', sn => {
      store.dispatch(receiveAccountRoles(sn.val()))
      // console.log('roles=', sn.val())
      offListener(projectsInfoPath)
      offListener(proposalsInfoPath)

      const state = store.getState()
      if (getViewAllProjectPermission(state) === true) {
        const projectRef = ref.child(projectsInfoPath)
        projectRef.on('value', sn => store.dispatch(receiveAccountProjectsInfo(sn.val())))
        addListener(projectsInfoPath, projectRef)

        const proposalRef = ref.child(proposalsInfoPath)
        proposalRef.on('value', sn => store.dispatch(receiveAccountProposalsInfo(sn.val())))
        addListener(proposalsInfoPath, proposalRef)
      } else {
        const projectRef = ref.child(projectsInfoPath).orderByChild(`admins/${user.id}`).equalTo(true)
        projectRef.on('value', sn => store.dispatch(receiveAccountProjectsInfo(sn.val())))
        addListener(projectsInfoPath, projectRef)

        const proposalRef = ref.child(proposalsInfoPath).orderByChild(`admins/${user.id}`).equalTo(true)
        proposalRef.on('value', sn => store.dispatch(receiveAccountProposalsInfo(sn.val())))
        addListener(proposalsInfoPath, proposalRef)
      }
    })
    addListener(rolesPath, rolesRef)
  }
}

function updateLastMessagesListeners (workOrders = {}) {
  for (const woId in workOrders) {
    const wo = workOrders[woId]
    const members = _.get(wo, 'members', {})
    for (const mId in members) {
      const messagesPath = `channels/${wo.projectId}/${mId}/messages`
      const r = ref.child(messagesPath)
      if (!hasListener(messagesPath)) {
        r.orderByChild('timestamp').limitToLast(1).on('value', sn => {
          const messages = sn.val()
          console.log('receive messages', messages, wo.projectId, mId)
          updatedDeliveryStatusForNewMessage(messages, wo.projectId, mId)
          store.dispatch(receiveMessages(messages, wo.projectId, mId))
        })
        console.log('-----> add messages path to listeners', messagesPath)
        addListener(messagesPath, r)
      }
      // typing
      const typingPath = `channels/${wo.projectId}/${mId}/typing`
      const rTyping = ref.child(typingPath)
      if (!hasListener(typingPath)) {
        rTyping.on('value', sn => {
          const typing = sn.val()
          console.log('receive typing', typing, wo.projectId, mId)
          store.dispatch(receiveTyping(typing, wo.projectId, mId))
        })
        addListener(typingPath, rTyping)
      }

      // Unread
      const unreadPath = `channels/${wo.projectId}/${mId}/unread`
      const rUnread = ref.child(unreadPath)
      if (!hasListener(unreadPath)) {
        rUnread.on('value', sn => {
          const unread = sn.val()
          console.log('receive unread', unread, wo.projectId, mId)
          store.dispatch(receiveUnread(unread, wo.projectId, mId))
        })
        addListener(unreadPath, rUnread)
      }

      // ReadBy
      const readByPath = `channels/${wo.projectId}/${mId}/readBy`
      const rReadBy = ref.child(readByPath)
      if (!hasListener(readByPath)) {
        rReadBy.on('value', sn => {
          const readBy = sn.val()
          console.log('receive readBy', readBy, wo.projectId, mId)
          store.dispatch(receiveReadBy(readBy, wo.projectId, mId))
        })
        addListener(unreadPath, rUnread)
      }
    }

    /** For private Chat */
    const privateMessagesPath = `channels/${wo.projectId}/private/messages`
    const rPriv = ref.child(privateMessagesPath)
    if (!hasListener(privateMessagesPath)) {
      rPriv.orderByChild('timestamp').limitToLast(1).on('value', sn => {
        const privMessages = sn.val()
        console.log('receive private messages', privMessages, wo.projectId)
        updatedDeliveryStatusForNewMessage(privMessages, wo.projectId)
        store.dispatch(receiveMessages(privMessages, wo.projectId))
      })
      console.log('-----> add messages path to listeners', privateMessagesPath)
      addListener(privateMessagesPath, rPriv)
    }

    const privateTypingPath = `channels/${wo.projectId}/private/typing`
    const rPrivTyping = ref.child(privateTypingPath)
    if (!hasListener(privateTypingPath)) {
      rPrivTyping.on('value', sn => {
        const privTyping = sn.val()
        console.log('receive private typing', privTyping, wo.projectId)
        store.dispatch(receiveTyping(privTyping, wo.projectId))
      })
      addListener(privateTypingPath, rPrivTyping)
    }

    // Unread
    const privUnreadPath = `channels/${wo.projectId}/private/unread`
    const rPrivUnread = ref.child(privUnreadPath)
    if (!hasListener(privUnreadPath)) {
      rPrivUnread.on('value', sn => {
        const privUnread = sn.val()
        console.log('receive unread', privUnread, wo.projectId)
        store.dispatch(receiveUnread(privUnread, wo.projectId))
      })
      addListener(privUnreadPath, rPrivUnread)
    }

    // readBy
    const privReadByPath = `channels/${wo.projectId}/private/readBy`
    const rPrivReadBy = ref.child(privReadByPath)
    if (!hasListener(privReadByPath)) {
      rPrivReadBy.on('value', sn => {
        const privReadBy = sn.val()
        console.log('receive readBy', privReadBy, wo.projectId)
        store.dispatch(receiveReadBy(privReadBy, wo.projectId))
      })
      addListener(privReadByPath, rPrivReadBy)
    }
  }
}

async function fetchWorkOrders (accountId) {
  console.log('fetchAccount', accountId)
  const fieldPath = `workOrders`
  const fieldRef = ref.child(fieldPath).orderByChild('accountId').equalTo(accountId)
  addListener(fieldPath, fieldRef)
  fieldRef.on('value', async sn => {
    const workOrders = sn.val() || {}
    store.dispatch(receiveWorkOrders(workOrders))
    updateLastMessagesListeners(workOrders)
  })
}

async function updateUserData (user) {
  console.log('updateUserData', user)
  const currentAccountId = _.get(user, 'currentAccountId')
  if (currentAccountId) {
    await fetchAccountDetail(user, currentAccountId)
    await fetchWorkOrders(currentAccountId)
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
  } catch (e) {
    console.log('fetch user error', e)
  }
}

async function onAuthStateChanged (authData) {
  console.log('authData', authData)
  if (authData) {
    await fetchUser(authData)
    navigationService.navigate(screens.APP)
  } else {
    console.log('onAuthStateChanged authData null')
    clearListeners()
    clearUserListener()
    firstAuth = true
    navigationService.navigate(screens.AUTH)
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
