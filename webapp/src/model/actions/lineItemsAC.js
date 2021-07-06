import * as types from 'model/actionTypes.js'

export function receiveLineItems (lineItems) {
  return {
    type: types.RECEIVE_LINE_ITEMS,
    lineItems
  }
}
