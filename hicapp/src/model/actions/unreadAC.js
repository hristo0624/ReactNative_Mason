import * as types from 'model/actionTypes.js'

export function receiveUnread (unread, projectId, channelId = 'private') {
  return {
    type: types.RECEIVE_UNREAD,
    unread,
    projectId,
    channelId
  }
}
