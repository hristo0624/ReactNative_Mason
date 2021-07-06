import * as types from 'model/actionTypes.js'

export function logoutUser () {
  return {
    type: types.LOGOUT
  }
}

export function receiveUser (user) {
  return {
    type: types.RECEIVE_USER,
    user
  }
}

export function clear (user) {
  return {
    type: types.CLEAR
  }
}

