import _ from 'lodash'
import * as types from 'model/actionTypes'

const initialState = null

export default function (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_READBY:
      return {
        ...state,
        [action.projectId]: {
          ..._.get(state, action.projectId, {}),
          [action.channelId]: {
            ..._.get(state, [action.projectId, action.channelId], {}),
            ...action.readBy
          }
        }
      }
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
