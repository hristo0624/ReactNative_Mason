import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import serviceAccount from '../serviceAccount.json'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mason-dev.firebaseio.com'
})
const config = functions.config()
const ref = admin.database().ref()

function createProposalUrl (accountId, proposalId) {
  return `${config.system.proposal_url}/${accountId}/${proposalId}`
}

async function checkAuth (authToken) {
  const decodedToken = await admin.auth().verifyIdToken(authToken)
  const uid = decodedToken.uid
  return uid
}

function updateUidByPhoneNumbers (uid, phones) {
  for (const phone of phones) {
    ref.child(`uidByPhone/${phone}`).set(uid)
  }
}

export default {
  createProposalUrl,
  checkAuth,
  updateUidByPhoneNumbers
}
