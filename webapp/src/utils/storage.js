
const IS_AUTHORIZED = 'isAuthorized'

export function isAuthorized () {
  return localStorage.getItem(IS_AUTHORIZED)
}

export function setAuthorized (flag) {
  if (flag) {
    localStorage.setItem(IS_AUTHORIZED, true)
  } else {
    localStorage.removeItem(IS_AUTHORIZED)
  }
}
