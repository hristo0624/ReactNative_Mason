import * as types from 'model/actionTypes'

const initialState = null

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_USER:
      return action.user
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
