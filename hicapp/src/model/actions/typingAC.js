import * as types from 'model/actionTypes.js'

export function receiveTyping (typing, projectId, channelId = 'private') {
  return {
    type: types.RECEIVE_TYPING,
    typing,
    projectId,
    channelId
  }
}
