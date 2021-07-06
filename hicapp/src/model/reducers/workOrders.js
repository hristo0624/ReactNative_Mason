import * as types from 'model/actionTypes'

const initialState = null

export default function (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_WORK_ORDERS:
      return action.workOrders
    case types.CLEAR:
      return initialState
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
