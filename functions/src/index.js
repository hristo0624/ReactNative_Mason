import * as functions from 'firebase-functions'
import triggers from './triggers'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import processProto from './processProto'
import workOrder from './workOrder'
import authProcessor from './authProcessor'
import getSubcontractors  from './parseSubcontractors'
import getHicInfo  from './getHicInfo'

const appProto = express()
appProto.use(cors({ origin: true }))
appProto.use(bodyParser.json())

appProto.post('/inviteMember', processProto.inviteMember)
appProto.post('/sendProposal', processProto.sendProposal)
appProto.post('/inviteSubs', workOrder.inviteSubs)
appProto.post('/requestSmsCode', authProcessor.sendSmsVerification)
appProto.post('/checkVerificationCode', authProcessor.checkVerificationCode)
appProto.get('/downloadContractPdf/:accountId/:proposalId', processProto.downloadContractPdf)
appProto.post('/getSubcontractors', getSubcontractors )
appProto.post('/getHicInfo', getHicInfo )

export const proto = functions.https.onRequest(appProto)
export const authOnDelete = triggers.authOnDelete
export const accountCompanyNameOnWrite = triggers.accountCompanyNameOnWrite
export const accountRoleOnWrite = triggers.accountRoleOnWrite
export const accountMemberOnDelete = triggers.accountMemberOnDelete
export const inviteOnDelete = triggers.inviteOnDelete
export const proposalOnAccepted = triggers.proposalOnAccepted
export const contractOnSigned = triggers.contractOnSigned
export const userSignatureOnWrite = triggers.userSignatureOnWrite
export const userNameOnWrite = triggers.userNameOnWrite
export const onMessageCreate = triggers.onMessageCreate
export const onReadByChange = triggers.onReadByChange

