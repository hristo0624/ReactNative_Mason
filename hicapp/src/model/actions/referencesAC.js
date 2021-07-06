import * as types from 'model/actionTypes'

export function receiveReferences (references) {
  return {
    type: types.RECEIVE_REFERENCES,
    references
  }
}
