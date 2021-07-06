import _ from 'lodash'
import { ref, auth } from 'constants/firebase'
import { offListener, addListener, hasListener } from 'controllers/listeners'
import { receiveMessages } from 'model/actions/messagesAC'
import deliveryStatus from 'shared/constants/deliveryStatus'
import { receiveProfile } from 'model/actions/profilesAC'
import { receiveWorkOrder } from 'model/actions/workOrdersAC'
import { receiveReadBy } from 'model/actions/readbyAC'
import store from 'model/store'

export function updatedDeliveryStatusForNewMessage (messages, projectId) {
  const userId = auth.currentUser.uid
  const p = `channels/${projectId}/${userId}/messages`
  for (const mId in messages) {
    const m = messages[mId]
    const status = _.get(m, 'status')
    if (status === deliveryStatus.SENT && m.userId !== userId) {
      ref.child(p).child(mId).child('status').set(deliveryStatus.DELIVERED)
    }
  }
}

export function updatedDeliveryStatusRead (messages, projectId) {
  const userId = auth.currentUser.uid
  const p = `channels/${projectId}/${userId}/messages`
  for (const mId in messages) {
    try {
      const m = messages[mId]
      const status = _.get(m, 'status')
      if (status === deliveryStatus.DELIVERED && m.userId !== userId) {
        ref.child(p).child(mId).child('status').set(deliveryStatus.READ)
      }
    } catch (e) {
      console.log('cant update status READ, error', e)
    }
  }
}

export function startTyping (projectId) {
  return async function (dispatch, getState) {
    const userId = auth.currentUser.uid
    ref.child(`channels/${projectId}/${userId}/typing/${userId}`).set(_.now())
  }
}

export function fetchChat (projectId) {
  return async function (dispatch, getState) {
    try {
      offListener('chat')
      const authUser = auth.currentUser

      const p = `channels/${projectId}/${authUser.uid}/messages`
      const fieldRef = ref.child(p)
      // console.log('project path', p)
      fieldRef.orderByChild('timestamp').limitToLast(20).on('value', sn => {
        const messages = sn.val() || {}
        updatedDeliveryStatusForNewMessage(messages, projectId)
        dispatch(receiveMessages(messages, projectId))
      })
      addListener('chat', fieldRef)
    } catch (e) {
      console.log('fetchProject error:', e.message)
    }
  }
}

export function sendMessage (msg, projectId) {
  return async function (dispatch, getState) {
    try {
      const state = getState()
      const user = state.user
      const message = {
        id: msg._id,
        userId: user.id,
        text: _.get(msg, 'text', null),
        timestamp: (new Date(msg.createdAt)).getTime(),
        status: deliveryStatus.SENT
      }
      await ref.child(`channels/${projectId}/${user.id}/messages/${msg._id}`).set(message)
    } catch (e) {
      console.log('sendMessage error:', e.message)
    }
  }
}

export function fetchProfile (userId) {
  return async function (dispatch, getState) {
    const p = `users/${userId}/profile`
    if (!hasListener(p)) {
      const r = ref.child(p)
      r.on('value', profileSN => {
        const profile = profileSN.val()
        dispatch(receiveProfile(userId, profile))
      })
      addListener(p, r)
    }
  }
}

export function fetchChatUserProfiles (projectId) {
  return async function (dispatch, getState) {
    const state = getState()
    // All chatroom other users are in readBy props
    const readBy = _.get(state.readBy, projectId, {})
    for (const userId in readBy) {
      const p = `users/${userId}/profile`
      if (!hasListener(p)) {
        const r = ref.child(p)
        r.on('value', profileSN => {
          const profile = profileSN.val()
          dispatch(receiveProfile(userId, profile))
        })
        addListener(p, r)
      }
    }
  }
}

const currentWorkOrders = {}

export function fetchWorkOrders (workOrdersIds) {
  return async function (dispatch, getState) {
    console.log('fetch work orders ids', workOrdersIds)
    // clear old listeners
    for (woId in currentWorkOrders) {
      if (_.indexOf(workOrdersIds, woId) < 0) offListener(`workOrders/${woId}`)
    }

    // add new
    for (woId of workOrdersIds) {
      const p = `workOrders/${woId}`
      if (!hasListener(p)) {
        const r = ref.child(p)
        r.on('value', workOrderSN => {
          const workOrder = workOrderSN.val()
          // console.log('received work order', workOrder, 'path', p)
          dispatch(receiveWorkOrder(workOrderSN.key, workOrder))
        })
        _.set(currentWorkOrders, woId, true)
        addListener(p, r)
      }
    }
  }
}

export function setReadByTime (projectId) {
  return async function (dispatch, getState) {
    const userId = auth.currentUser.uid
    ref.child(`channels/${projectId}/${userId}/readBy/${userId}`).set(_.now())
  }
}

