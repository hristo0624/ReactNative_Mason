import * as types from 'model/actionTypes.js'

export function receiveReadBy (readBy, projectId) {
  return {
    type: types.RECEIVE_READBY,
    readBy,
    projectId
  }
}
