import _ from 'lodash'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import twilioClient from './twilioClient'
import utils from './utils'
const config = functions.config()
const ref = admin.database().ref()
const auth = admin.auth()

const EXPIRATION_TIME = 5 // minutes

function generateCode () {
  return Math.floor(((Math.random() * 8999) + 1000))
}

async function sendSmsVerification (req, res) {
  const body = req.body
  console.log('sendSmsVerification: body:', body)
  const { phone } = body
  try {
    const testUser = ['+11111111111', '+22222222222', '+13333333333'].includes(phone)

    const code = testUser ? 1111 : generateCode()
    console.log('code', code)
    const expiration = Date.now() + (EXPIRATION_TIME * 60000)
    const verification = { code, expiration }

    let success = testUser
    if (!testUser) {
      const msg = {
        body: `Your Mason verification code is: ${code}`,
        to: phone,
        from: config.twilio.phone
      }
      success = await twilioClient.sendMessage(msg)
    }

    if (success) {
      await ref.child(`verification/${phone}`).set(verification)
      return res.json({ status: 'OK' })
    } else {
      return res.json({ error: 'FF:sendCode, error' })
    }
  } catch (e) {
    console.log('sendCode error', e)
    return res.json({ error: 'FF:sendCode' + e.message.toString })
  }
}

async function checkVerificationCode (req, res) {
  const body = req.body
  console.log('sendSmsVerification: body:', body)
  const { phone, code } = body
  try {
    const infoSN = await ref.child(`verification/${phone}`).once('value')
    const info = infoSN.val()
    if (info) {
      const timeNow = _.now()
      if (info.expiration < timeNow) {
        return res.json({ error: 'The code is expired' })
      } else if (_.toString(info.code) === _.toString(code)) {
        const uidSN = await ref.child(`uidByPhone/${phone}`).once('value')
        let uid = uidSN.val()
        if (!uid) {
          const newUser = await auth.createUser({
            emailVerified: false,
            phoneNumber: phone,
            disabled: false
          })

          uid = _.get(newUser, 'uid')
          console.log('new user has been created', uid)
          utils.updateUidByPhoneNumbers(uid, [ phone ])
        }
        const customToken = await auth.createCustomToken(uid)
        return res.json({ authToken: customToken })
      } else {
        return res.json({ error: 'The code is not valid' })
      }
    } else {
      return res.json({ error: 'The code is not valid' })
    }
  } catch (e) {
    console.log('sendCode error', e)
    return res.json({ error: 'FF:sendCode' + e.message.toString() })
  }
}

export default {
  sendSmsVerification,
  checkVerificationCode
}
