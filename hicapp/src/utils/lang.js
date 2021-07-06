import _ from 'lodash'

import screens from 'constants/screens'

/* Placeholder fotmat: `{{placeholder}}` and `%{placeholder}`. */
const PLACEHOLDER_FORMAT = /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm

function missingTranslation (key) {
  return `?__${key}`
}

function missingPlaceholder (placeholder) {
  return `?__${placeholder}`
}

function pluralize (t, count) {
  if (!t) return t
  if (typeof t === 'string') return t
  if (count === 1) {
    return t.one || t
  }
  return t.other || t
}

function translate (lang) {
  return function (key, options = {}) {
    if (!key || _.isEmpty(lang)) {
      return ''
    }
    let t = _.get(lang, key)
    if (_.has(options, 'count')) {
      t = pluralize(t, options.count)
    }
    if (!t) {
      return missingTranslation(key)
    }
    return interpolate(t, options)
  }
}

function interpolate (msg, options) {
  let message = msg
  if (!message) {
    return message
  }

  options = options || {}
  const matches = message.match(PLACEHOLDER_FORMAT)

  if (!matches) {
    return message
  }

  let value
  while (matches.length) {
    const placeholder = matches.shift()
    const name = placeholder.replace(PLACEHOLDER_FORMAT, '$1')
    if (_.has(options, name)) {
      value = _.get(options, name, '').toString()
    } else {
      value = missingPlaceholder(placeholder)
    }

    const regex = new RegExp(
      placeholder.replace(/\{/gm, '\\{').replace(/\}/gm, '\\}')
    )
    message = message.replace(regex, value)
  }

  return message.replace(/_#\$#_/g, '$')
}

function getScreenKey (screen) {
  switch (screen) {
    case screens.HOME:
      return 'home'
    case screens.INVOICES:
      return 'invoices'
    case screens.ESTIMATES:
      return 'estimates'
    case screens.PURCHASE_ORDERS:
      return 'purchase_orders'
    case screens.CREDIT_MEMOS:
      return 'credit_memos'
    case screens.CLIENTS:
      return 'clients'
    case screens.ITEMS:
      return 'items'
    case screens.EXPENSES:
      return 'expenses'
    case screens.REPORTS:
      return 'reports'
    case screens.REPORTS_LIST:
      return 'reports_list'
    case screens.SETTINGS:
      return 'settings'
    case screens.NOTIFICATIONS:
      return 'notifications'
    case screens.CLIENT_COMMUNICATION:
      return 'client_communication'
    case screens.PAYMENT_REMINDERS:
      return 'payment_reminders'
    default:
      return 'unknown screen'
  }
}

function translatePaymentTerm (translate, v) {
  if (_.isNil(v)) {
    return translate('none')
  } if (v === 0) {
    return translate('same_day')
  } else {
    return `${v} ${translate('days')}`
  }
}

function translateDueDays (translate, v) {
  if (_.isNil(v)) {
    return ''
  } if (v === 0) {
    return translate('due_today')
  } else if (v < 0) {
    return translate('overdue_days', { count: -v })
  } else if (v > 0) {
    return translate('due_days', { count: v })
  }
}

export { translate, getScreenKey, translatePaymentTerm, translateDueDays }
