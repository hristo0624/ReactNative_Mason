import * as types from 'model/actionTypes.js'

export function receiveTyping (typing, projectId) {
  return {
    type: types.RECEIVE_TYPING,
    typing,
    projectId
  }
}
