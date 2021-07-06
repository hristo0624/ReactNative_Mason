import _ from 'lodash'
import { ref, auth } from 'constants/firebase'
import { offListener, addListener } from 'controllers/listeners'
import { receiveMessages } from 'model/actions/messagesAC'
import deliveryStatus from 'shared/constants/deliveryStatus'

export function updatedDeliveryStatusForNewMessage (messages, projectId, channelId = 'private') {
  const p = `channels/${projectId}/${channelId}/messages`
  for (const mId in messages) {
    const m = messages[mId]
    const status = _.get(m, 'status')
    if (status === deliveryStatus.SENT && m.userId !== auth.currentUser.uid) {
      ref.child(p).child(mId).child('status').set(deliveryStatus.DELIVERED)
    }
  }
}

export function updatedDeliveryStatusRead (messages, projectId, channelId = 'private') {
  const p = `channels/${projectId}/${channelId}/messages`
  console.log('updatedDeliveryStatusRead, amount of messages', _.size(messages))
  for (const mId in messages) {
    try {
      const m = messages[mId]
      const status = _.get(m, 'status')
      console.log('update delivery status READ for messages, status', status, 'need to be updated:', status === deliveryStatus.DELIVERED)
      if (status === deliveryStatus.DELIVERED && m.userId !== auth.currentUser.uid) {
        ref.child(p).child(mId).child('status').set(deliveryStatus.READ)
      }
    } catch (e) {
      console.log('cant update status READ, error', e)
    }
  }
}

export function startTyping (projectId, channelId = 'private') {
  return async function (dispatch, getState) {
    const userId = auth.currentUser.uid
    ref.child(`channels/${projectId}/${channelId}/typing/${userId}`).set(_.now())
  }
}

export function fetchChat (projectId, channelId = 'private') {
  return async function (dispatch, getState) {
    try {
      offListener('chat')
      const p = `channels/${projectId}/${channelId}/messages`
      const fieldRef = ref.child(p)
      // console.log('project path', p)
      fieldRef.orderByChild('timestamp').limitToLast(20).on('value', sn => {
        const messages = sn.val() || {}
        updatedDeliveryStatusForNewMessage(messages, projectId, channelId)
        dispatch(receiveMessages(messages, projectId, channelId))
      })
      addListener('chat', fieldRef)
    } catch (e) {
      console.log('fetchProject error:', e.message)
    }
  }
}

export function sendMessage (msg, projectId, channelId = 'private') {
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

      await ref.child(`channels/${projectId}/${channelId}/messages/${msg._id}`).set(message)
    } catch (e) {
      console.log('sendMessage error:', e.message)
    }
  }
}

export function setReadByTime (projectId, channelId = 'private') {
  return async function (dispatch, getState) {
    const userId = auth.currentUser.uid
    ref.child(`channels/${projectId}/${channelId}/readBy/${userId}`).set(_.now())
  }
}
