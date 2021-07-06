import * as types from 'model/actionTypes.js'

export function clearWorkOrders () {
  return {
    type: types.CLEAR_WORK_ORDERS
  }
}

export function receiveWorkOrder (workOrderId, workOrder) {
  return {
    type: types.RECEIVE_WORK_ORDER,
    workOrderId,
    workOrder
  }
}
