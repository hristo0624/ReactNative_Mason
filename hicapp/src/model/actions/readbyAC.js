import * as types from 'model/actionTypes.js'

export function receiveReadBy (readBy, projectId, channelId = 'private') {
  return {
    type: types.RECEIVE_READBY,
    readBy,
    projectId,
    channelId
  }
}
