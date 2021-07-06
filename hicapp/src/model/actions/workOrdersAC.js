import * as types from 'model/actionTypes.js'

export function receiveWorkOrders (workOrders) {
  return {
    type: types.RECEIVE_WORK_ORDERS,
    workOrders
  }
}
