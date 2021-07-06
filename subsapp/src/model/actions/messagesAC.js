import * as types from 'model/actionTypes.js'

export function receiveMessages (messages, projectId) {
  return {
    type: types.RECEIVE_MESSAGES,
    messages,
    projectId
  }
}
