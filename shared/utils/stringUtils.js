import _ from 'lodash'

export function initialsByName (name) {
  const ar = _.split(name, ' ')
  const fst = _.get(ar, 0)
  const snd = _.get(ar, ar.length - 1)
  return initialsByFirstLastName(fst, snd)
}

export function initialsByFirstLastName (firstName, lastName) {
  const fst = _.get(firstName, 0, '')
  const snd = _.get(lastName, 0, '')
  return `${fst}${snd}`
}

export function cutString (str, num) {
  if (num > 3 && str.length > num) {
    return `${str.substr(str, num - 3)}...`
  }
  return str
}

export function firstNameByName (name) {
  return _.get(_.split(name, ' '), 0)
}

export function typingStringByNames (names = []) {
  switch (names.length) {
    case 0: return ''
    case 1: return `${names[0]} is typing...`
    case 2: return `${names[0]} and ${names[1]} are typing...`
    default: return `${names[0]} and ${names.length - 1} others are typing...`
  }
}