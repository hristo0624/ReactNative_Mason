import _ from 'lodash'

let listeners = {}

export function addListener (key, l) {
  listeners[key] = l
}

export function removeListener (key) {
  const l = listeners[key]
  if (l) {
    l.off()
    delete listeners[key]
  }
}

export function hasListener (key) {
  return _.has(listeners, key)
}

export function clearListeners () {
  console.log('clear listeners:')
  for (const key in listeners) {
    const l = listeners[key]
    console.log('off:', l)
    l.off()
  }

  listeners = {}
}

let userRef

export function setUserRef (ref) {
  userRef = ref
}

export function clearUserListener () {
  if (userRef) userRef.off()
}
