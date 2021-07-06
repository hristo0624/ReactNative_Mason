import * as types from 'model/actionTypes.js'

export function receiveProject (project) {
  return {
    type: types.RECEIVE_PROJECT,
    project
  }
}
