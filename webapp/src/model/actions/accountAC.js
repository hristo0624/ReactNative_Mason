import * as types from 'model/actionTypes.js'

export function receiveAccount (account) {
  return {
    type: types.RECEIVE_ACCOUNT,
    account
  }
}
