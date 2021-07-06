import { Dimensions } from 'react-native'
import * as types from 'model/actionTypes'

const initialState =
  {
    ...Dimensions.get('window'),
    keyboardHeight: 0
  }

export default function user (state = initialState, action = '') {
  switch (action.type) {
    case types.UPDATE_VIEWPORT:
      return {
        ...Dimensions.get('window'),
        keyboardHeight: state.keyboardHeight
      }
    case types.UPDATE_KEYBOARD_HEIGHT:
      return {
        ...state,
        keyboardHeight: action.height
      }
    default :
      return state
  }
}
