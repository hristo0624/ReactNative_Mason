import * as types from 'model/actionTypes.js'

export function updateViewport () {
  return {
    type: types.UPDATE_VIEWPORT
  }
}

export function updateKeyboardHeight (v) {
  return {
    type: types.UPDATE_KEYBOARD_HEIGHT,
    height: v
  }
}
