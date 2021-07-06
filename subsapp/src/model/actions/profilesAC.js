import * as types from 'model/actionTypes.js'

export function receiveProfile (userId, profile) {
  return {
    type: types.RECEIVE_PROFILE,
    userId,
    profile
  }
}
