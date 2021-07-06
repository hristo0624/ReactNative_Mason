function validate (reg, val, errorMessage) {
  if (reg.test(val.toLowerCase())) {
    return null
  } else {
    return errorMessage
  }
}

export function validateEmail (v) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return validate(reg, v, 'Invalid email address')
}

export function validatePhone (v) {
  let reg =  /^\+?\d{10}|\+?\d{11}$/
  let error = validate(reg, v, 'Phone number should be 10 or 11 digit number')
  if (error) {
    reg = /^\+?([0-9]{1})\)?[-. ]?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    error = validate(reg, v, 'Phone number format should be +X-XXX-XXX-XXXX')
  }

  return error
}