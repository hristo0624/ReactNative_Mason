import _ from 'lodash'
import * as types from 'model/actionTypes'

const initialState = {}

export default function (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_WORK_ORDER:
      if (_.isNil(action.workOrder)) {
        const newState = {...state}
        delete newState[action.workOrderId]
        return newState
      } else {
        return {
          ...state,
          [action.workOrderId]: action.workOrder
        }
      }
    case types.CLEAR_WORK_ORDERS:
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
