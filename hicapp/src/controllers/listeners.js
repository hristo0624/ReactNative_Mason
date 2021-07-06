import _ from 'lodash'

let listeners = {}

export function addListener (key, l) {
  // console.log('add listener', l)
  listeners[key] = l
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

export function offListener (key) {
  const l = _.get(listeners, key)
  if (l) {
    l.off()
    delete listeners[key]
  }
}

let userRef

export function setUserRef (ref) {
  userRef = ref
}

export function clearUserListener () {
  if (userRef) userRef.off()
}
