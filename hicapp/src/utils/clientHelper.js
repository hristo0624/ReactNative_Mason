import _ from 'lodash'

export function getEmails (client) {
  let emails = _.get(client, 'emails', null)
  if (!emails) {
    const email = _.get(client, 'email', null)
    if (email) {
      emails = [ email ]
    } else {
      emails = [ '' ]
    }
  }
  return emails
}
