import admin from 'firebase-admin'
import _ from 'lodash'
import * as functions from 'firebase-functions'
import sendgridClient from './sendgridClient'
import utils from './utils'
import documentActions from './documentActions'
const config = functions.config()
const ref = admin.database().ref()
const auth = admin.auth()

async function sendInviteToEmail (req, memberId, accountId, email, inviteFromEmail, role) {
  const infoId = `${accountId}${memberId}`
  const origin = req.get('origin') || 'https://app.usemason.com' // FIX ME: add this to env
  console.log('sendInviteToEmail origin', origin)

  const actionCodeSettings = {
    url: `${origin}/finishSignUp/${infoId}`,
    handleCodeInApp: true
  }
  try {
    const link = await auth.generateSignInWithEmailLink(email, actionCodeSettings)
    const inviteInfo = {
      link,
      accountId,
      userId: memberId,
      email
    }
    console.log('sendInviteToEmail: add inviteInfo', inviteInfo)
    await ref.child(`invites/${infoId}`).set(inviteInfo)
    const templateData = {
      fromEmail: inviteFromEmail,
      link,
      role
    }
    console.log('send mail through sendgrid, templateData', templateData, 'to email', email)
    const templateId = config.sendgrid.invitation_template
    const sendgridRes = await sendgridClient.sendEmail(email, templateId, templateData)
    console.log('sendgrid res', sendgridRes)
  } catch (e) {
    console.log('sendInviteToEmail: error:', e)
  }
  return null
}

async function inviteMember (req, res) {
  const body = req.body
  console.log('inviteMember: body:', body)
  const { authToken, accountId, email, role, mode, inviteFromEmail } = body
  const uid = await utils.checkAuth(authToken)
  if (uid) {
    const curAdminsSN = await ref.child(`accounts/${accountId}/admins`).once('value')
    const curAdmins = curAdminsSN.val() || {}
    if (_.has(curAdmins, uid)) {
      let memberId
      try {
        const userRecord = await auth.getUserByEmail(email)
        console.log('inviteMember: Successfully fetched user data:', userRecord.toJSON())
        memberId = userRecord.uid
      } catch (e) {
        console.log('inviteMember: user with the email does not exist yet')
      }

      if (!memberId) {
        console.log('inviteMember: need to create a new user')
        try {
          const member = await auth.createUser({
            email: email,
            emailVerified: false,
            disabled: false
          })
          memberId = member.uid
          console.log('inviteMember: new user has been created', member.toJSON())
        } catch (e) {
          console.log('inviteMember: creating user error', e)
        }
      }

      if (memberId) {
        let member
        let memberSN = await ref.child(`users/${memberId}`).once('value')
        member = memberSN.val()

        // create and update user record if needed
        if (!member) {
          console.log('inviteMember: member does not exist in the database, create user record')
          const m = {
            id: memberId,
            profile: {
              createdAt: _.now(),
              email: email
            },
            accounts: {
              [accountId]: {
                id: accountId,
                role
              }
            },
            currentAccountId: accountId
          }
          console.log('inviteMember: member record', m)
          await ref.child(`users/${memberId}`).set(m)
        } else {
          const memberUpdate = {
            id: accountId,
            role
          }
          console.log('inviteMember, member exists in the database, just update accounts', memberUpdate)
          await ref.child(`users/${memberId}/accounts/${accountId}`).set(memberUpdate)
        }

        // add the user as admin to the account
        const acUpdate = {
          email,
          id: memberId,
          role,
          pending: true
        }
        console.log('inviteMember update account admins', acUpdate)
        await ref.child(`accounts/${accountId}/admins/${memberId}`).set(acUpdate)

        await sendInviteToEmail(req, memberId, accountId, email, inviteFromEmail, role)

        return res.json({ success: true })
      } else {
        console.log('inviteMember: cant create member')
        return res.status(501).send()
      }
    } else {
      console.log('inviteMember: the user is not admin')
      return res.status(403).send()
    }
  } else {
    console.log('inviteMember: authToken validation error')
    return res.status(403).send()
  }
}

async function sendProposal (req, res) {
  const body = req.body
  console.log('sendProposal: body:', body)
  const { authToken, accountId, proposalId } = body
  const uid = await utils.checkAuth(authToken)
  if (uid) {
    const curAdminsSN = await ref.child(`accounts/${accountId}/admins`).once('value')
    const curAdmins = curAdminsSN.val() || {}
    if (_.has(curAdmins, uid)) {
      const proposalSN = await ref.child(`proposals/${accountId}/${proposalId}`).once('value')
      const proposal = proposalSN.val()
      const toEmail = _.get(proposal, 'share.email', _.get(proposal, 'owner.email'))
      if (proposal) {
        const companyName = _.get(proposal, 'company.name', '')
        const templateData = {
          companyName,
          url: utils.createProposalUrl(accountId, proposalId)
        }
        const templateId = config.sendgrid.proposal_template
        const sendgridRes = await sendgridClient.sendEmail(toEmail, templateId, templateData)
        console.log('sendgrid res', sendgridRes)
        return res.json({ success: true })
      } else {
        console.log('inviteMember: the proposal is not found')
        return res.status(404).send()
      }
    } else {
      console.log('inviteMember: the user is not admin')
      return res.status(403).send()
    }
  } else {
    console.log('sendProposl: authToken validation error')
    return res.status(403).send()
  }
}

async function downloadContractPdf (req, res) {
  try {
    const accountId = _.get(req, 'params.accountId')
    const proposalId = _.get(req, 'params.proposalId')
    if (accountId && proposalId) {
      const proposalSN = await ref.child(`proposals/${accountId}/${proposalId}`).once('value')
      const proposal = proposalSN.val()
      if (proposal) {
        const htmlContract = documentActions.makeTemplatedHtmlContract(proposal)
        const buf = await documentActions.createPdfBufferAsync(htmlContract)
        const fileName = 'contract.pdf'
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=${fileName}`,
          'Content-Length': buf.length
        })
        return res.end(buf)
      } else {
        return res.status(404).send()
      }
    } else {
      console.log('downloadContractPdf: invalid request params:', req.params)
      return res.status(502).send()
    }
  } catch (e) {
    console.error('downloadContractPdf error', e)
    return res.status(501).send()
  }
}

export default {
  sendProposal,
  inviteMember,
  downloadContractPdf
}
