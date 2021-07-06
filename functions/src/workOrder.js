import admin from 'firebase-admin'
import _ from 'lodash'
import utils from './utils'
import generate from 'firebase-auto-ids'
const ref = admin.database().ref()
const auth = admin.auth()

async function getUidByPhoneNumbers (phones) {
  for (const phone of phones) {
    const uidSN = await ref.child(`uidByPhone/${phone}`).once('value')
    const uid = uidSN.val()
    if (!_.isNil(uid)) return uid
  }
  return null
}

async function inviteContact (c, workOrder, profile) {
  console.log('inviteContact', c, workOrder)
  const primaryPhone = c.phone
  const phoneNumbers = [ primaryPhone ]
  const phonesEmails = _.get(c, 'emailsPhones', {})
  for (const peId in phonesEmails) {
    const pe = phonesEmails[peId]
    if (pe.type === 'phone') phoneNumbers.push(pe.value)
  }
  console.log('inviteContact, phone numbers', phoneNumbers)
  let uid = await getUidByPhoneNumbers(phoneNumbers)
  console.log('getUidByPhoneNumbers return', uid)
  if (!uid) {
    const newUser = await auth.createUser({
      email: _.get(c, 'email'),
      emailVerified: false,
      phoneNumber: primaryPhone,
      displayName: `${_.get(c, 'firstName', '')} ${_.get(c, 'lastName', '')}`,
      disabled: false
    })
    uid = _.get(newUser, 'uid')
    console.log('new user has been created', uid)
    utils.updateUidByPhoneNumbers(uid, phoneNumbers)

    const dbUser = {
      id: uid,
      isSub: true,
      createdAt: _.now(),
      address: _.get(c, 'address', null),
      profile: {
        email: _.get(c, 'email', null),
        firstName: _.get(c, 'firstName', null),
        lastName: _.get(c, 'lastName', null),
        phone: primaryPhone
      }
    }

    await ref.child(`users/${uid}`).set(dbUser)
  }
  const accountContact = {
    id: uid,
    email: _.get(c, 'email', null),
    firstName: _.get(c, 'firstName', null),
    lastName: _.get(c, 'lastName', null),
    phone: primaryPhone,
    address: _.get(c, 'address', null),
    emailsPhones: _.get(c, 'emailsPhones', null)
  }
  await ref.child(`accounts/${workOrder.accountId}/contacts/${uid}`).update(accountContact)
  // updating projectInfo
  const projectInfo = {
    address: _.get(workOrder, 'projectAddress', null),
    projectManager: _.get(workOrder, 'projectManager', null)
  }
  await ref.child(`users/${uid}/projects/${workOrder.projectId}/id`).set(workOrder.projectId)
  await ref.child(`users/${uid}/projects/${workOrder.projectId}/projectInfo`).update(projectInfo)

  // add project to the sub
  await ref.child(`users/${uid}/projects/${workOrder.projectId}/workOrders/${workOrder.id}/status`).set('new')

  // create channel and add the message to it
  const messageId = generate(_.now())
  const msg = {
    id: messageId,
    userId: profile.id,
    name: profile.name,
    text: _.get(c, 'message', null),
    timestamp: _.now()
  }
  await ref.child(`channels/${workOrder.projectId}/${uid}/messages/${messageId}`).set(msg)

  return {
    id: uid,
    firstName: accountContact.firstName,
    lastName: accountContact.lastName,
    lastActivityTime: _.now()
  }
}

async function inviteSubs (req, res) {
  const body = req.body
  console.log('inviteSubs: body:', body)
  const { authToken, accountId, projectId, workOrderId, contacts } = body
  const uid = await utils.checkAuth(authToken)
  if (uid) {
    const curAdminsSN = await ref.child(`accounts/${accountId}/admins`).once('value')
    const curAdmins = curAdminsSN.val() || {}
    if (_.has(curAdmins, uid)) {
      console.log('inviteSubs: auth OK')
      const userProfileSN = await ref.child(`users/${uid}/profile`).once('value')
      const profile = userProfileSN.val()
      profile.id = uid

      const workOrderSN = await ref.child(`workOrders/${workOrderId}`).once('value')
      const workOrder = workOrderSN.val()
      const membersList = await Promise.all(_.map(contacts, c => inviteContact(c, workOrder, profile)))
      const workOrderMembers = {}
      for (const m of membersList) {
        workOrderMembers[m.id] = m
      }
      await ref.child(`workOrders/${workOrderId}/members`).set(workOrderMembers)
      return res.json('OK')
    } else {
      console.log('inviteSubs: the user is not admin')
      return res.status(403).send()
    }
  } else {
    console.log('inviteSubs: authToken validation error')
    return res.status(403).send()
  }
}

export default {
  inviteSubs
}
