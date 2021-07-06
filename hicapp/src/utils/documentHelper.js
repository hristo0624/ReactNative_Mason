import moment from 'moment'
import _ from 'lodash'

export function daysFromDueDate (dueDate) {
  const today = moment().startOf('day')
  const dueDay = moment(Number(dueDate)).startOf('day')
  return today.diff(dueDay, 'days')
}

export function isOverdue (document) {
  const daysDiff = daysFromDueDate(document.dueDate)
  return daysDiff > 0
}

export function getPaidValue (document) {
  const transactions = _.get(document, 'paymentTransactions')
  let paidValue = 0
  for (const id in transactions) {
    const tr = transactions[id]
    paidValue += tr.amount
  }
  return paidValue
}

export function getPaidDate (document) {
  const transactions = _.get(document, 'paymentTransactions')
  let paidDate = 0
  for (const id in transactions) {
    const tr = transactions[id]
    if (tr.date > paidDate) {
      paidDate = tr.date
    }
  }
  if (paidDate === 0) {
    return null
  } else {
    return paidDate
  }
}

export function isPaid (doc) {
  const { paidDate, paidValue, total } = doc
  return !!paidDate && paidValue >= total
}

export function getDefaultComments (documentOptions, type) {
  const { genericNotes } = documentOptions
  return _.get(documentOptions, `${genericNotes ? 'generic' : type}Comment`, null)
}
