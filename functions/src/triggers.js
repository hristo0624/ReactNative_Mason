/* eslint import/first: off */
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import _ from 'lodash'
import sendgridClient from './sendgridClient'
import utils from './utils'
import documentActions from './documentActions'

const config = functions.config()
const ref = admin.database().ref()
const db = functions.database

export const authOnDelete = functions.auth.user().onDelete((user) => {
  console.log('on user deleted', user.uid)
  const userId = user.uid
  return ref.child(`users/${userId}`).set(null)
})

export const accountCompanyNameOnWrite = db.ref('/accounts/{accId}/company/name').onWrite((change, context) => {
  return change.after.ref.parent.child('admins').once('value', adminsSN => {
    const admins = adminsSN.val()
    if (admins) {
      const accId = context.params.accId
      const companyName = change.after.val()
      return _.map(admins, (v, adminId) => ref.child(`users/${adminId}/accounts/${accId}/companyName`).set(companyName))
    }
    return null
  })
})

export const accountRoleOnWrite = db.ref('/accounts/{accId}/admins/{userId}/role').onWrite((change, context) => {
  const accId = context.params.accId
  const userId = context.params.userId
  const newRole = change.after.val()
  return ref.child(`users/${userId}/accounts/${accId}/role`).set(newRole)
})

export const accountMemberOnDelete = db.ref('/accounts/{accId}/admins/{userId}').onDelete((snapshot, context) => {
  const accId = context.params.accId
  const userId = context.params.userId
  const infoId = `${accId}${userId}`
  return [
    ref.child(`users/${userId}/accounts/${accId}`).set(null),
    ref.child(`invites/${infoId}`).set(null)
  ]
})

export const inviteOnDelete = db.ref('/invites/{infoId}').onDelete((snapshot, context) => {
  const original = snapshot.val()
  const accId = original.accountId
  const userId = original.userId
  return ref.child(`/accounts/${accId}/admins/${userId}/pending`).set(null)
})

export const proposalOnAccepted = db.ref('/proposals/{accId}/{proposalId}/accepted').onCreate(async (snapshot, context) => {
  const accountId = context.params.accId
  const proposalId = context.params.proposalId
  const proposalSN = await ref.child(`proposals/${accountId}/${proposalId}`).once('value')
  const proposal = proposalSN.val()
  const toEmail = _.get(proposal, 'share.email', _.get(proposal, 'owner.email'))
  const companyName = _.get(proposal, 'company.name', '')
  const templateData = {
    companyName,
    url: utils.createProposalUrl(accountId, proposalId)
  }
  const templateId = config.sendgrid.proposal_accepted_template
  try {
    const sendgridRes = await sendgridClient.sendEmail(toEmail, templateId, templateData)
    console.log('sendgrid res', sendgridRes)
  } catch (e) {
    console.warn('proposalOnAccepted: sendgrid error', e)
  }
  return ref.child(`/accounts/${accountId}/proposalsInfo/${proposalId}/status`).set('accepted')
})

export const contractOnSigned = db.ref('/proposals/{accId}/{proposalId}/ownerContractSignature').onCreate(async (snapshot, context) => {
  const accId = context.params.accId
  const proposalId = context.params.proposalId
  const proposalSN = await ref.child(`/proposals/${accId}/${proposalId}`).once('value')
  const proposal = proposalSN.val()

  // email the client
  const toEmail = _.get(proposal, 'share.email', _.get(proposal, 'owner.email'))
  const companyName = _.get(proposal, 'company.name', '')
  const templateData = {
    companyName
  }
  const templateId = config.sendgrid.contract_signed_template
  try {
    const htmlContract = documentActions.makeTemplatedHtmlContract(proposal)
    const buf = await documentActions.createPdfBufferAsync(htmlContract)
    const attachments = [{
      'Content-Length': buf.length,
      content: buf.toString('base64'),
      filename: 'contract.pdf',
      type: 'application/pdf',
      disposition: 'attachment',
      content_id: `${accId}/${proposalId}`
    }]
    const sendgridRes = await sendgridClient.sendEmail(toEmail, templateId, templateData, attachments)
    console.log('contractOnSigned: sendgrid res', sendgridRes)
  } catch (e) {
    console.warn('contractOnSigned: sendgrid error', e)
  }

  // project
  // set project creation time
  _.set(proposal, 'createdAt', _.now())
  await ref.child(`/projects/${accId}/${proposalId}`).set(proposal)

  // creating project info
  const projectInfo = {
    id: proposal.id,
    owner: {
      firstName: _.get(proposal, 'owner.firstName', null),
      lastName: _.get(proposal, 'owner.lastName', null)
    },
    address: _.get(proposal, 'address', null),
    projectCost: proposal.projectCost,
    admins: _.get(proposal, 'admins', null),
    createdAt: _.get(proposal, 'createdAt', null)
  }
  await ref.child(`/accounts/${accId}/projectsInfo/${proposalId}`).update(projectInfo)
  return ref.child(`/accounts/${accId}/proposalsInfo/${proposalId}/status`).set('signed')
})

export const userSignatureOnWrite = db.ref('/users/{userId}/signature').onWrite(async (change, context) => {
  const userId = context.params.userId
  const signature = change.after.val()
  const accountsSN = await ref.child(`users/${userId}/accounts`).once('value')
  const accounts = accountsSN.val() || {}
  const tasks = _.map(accounts, (ac, accountId) => ref.child(`accounts/${accountId}/admins/${userId}/signature`).set(signature))
  return Promise.all(tasks)
})

export const userNameOnWrite = db.ref('/users/{userId}/profile/name').onWrite(async (change, context) => {
  const userId = context.params.userId
  const name = change.after.val()
  const accountsSN = await ref.child(`users/${userId}/accounts`).once('value')
  const accounts = accountsSN.val() || {}
  const tasks = _.map(accounts, (ac, accountId) => ref.child(`accounts/${accountId}/admins/${userId}/name`).set(name))
  return Promise.all(tasks)
})

export const onMessageCreate = db.ref('/channels/{projectId}/{channelId}/messages/{messageId}').onCreate(async (sn, context) => {
  try {
    const projectId = context.params.projectId
    const channelId = context.params.channelId
    console.log('on new message', sn.val())
    const inc = 1
    // const inc = _.size(sn.numChildren())
    console.log('inc', inc)
    const unreadPath = `/channels/${projectId}/${channelId}/unread`
    console.log('unreadPath', unreadPath)
    const unreadSN = await ref.child(unreadPath).once('value')
    const unread = unreadSN.val()
    console.log('current unread', unread)
    if (unread) {
      const res = {}
      for (const userId in unread) {
        const curValue = unread[userId]
        _.set(res, userId, curValue + inc)
      }
      console.log('new unread', res)
      return ref.child(unreadPath).update(res)
    } else {
      return null
    }
  } catch (e) {
    console.log('FF error, trigger onMessageCreate', event)
    return null
  }
})

export const onReadByChange = db.ref('/channels/{projectId}/{channelId}/readBy/{userId}').onWrite(async (change, context) => {
  const projectId = context.params.projectId
  const channelId = context.params.channelId
  const userId = context.params.userId
  console.log('reset unread messages for path', `/channels/${projectId}/${channelId}/unread/${userId}`)
  return ref.child(`/channels/${projectId}/${channelId}/unread/${userId}`).set(0)
})

export default {
  authOnDelete,
  accountCompanyNameOnWrite,
  accountRoleOnWrite,
  accountMemberOnDelete,
  inviteOnDelete,
  proposalOnAccepted,
  contractOnSigned,
  userSignatureOnWrite,
  userNameOnWrite,
  onMessageCreate,
  onReadByChange
}
