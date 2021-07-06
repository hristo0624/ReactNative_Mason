import * as types from 'model/actionTypes.js'

export function receiveUnread (unread, projectId) {
  return {
    type: types.RECEIVE_UNREAD,
    unread,
    projectId
  }
}
