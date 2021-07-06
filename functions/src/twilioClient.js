import * as functions from 'firebase-functions'
import twilio from 'twilio'
import admin from 'firebase-admin'
const config = functions.config()
const ref = admin.database().ref()

const client = twilio(config.twilio.sid, config.twilio.secret)

// function fetchNumbers () {
//   const db = admin.firestore()
//   client.incomingPhoneNumbers.each(number => {
//     console.log('number', number);
//     db.collection('twilioPhoneNumbers').doc(number.phoneNumber).set({
//       sid: number.sid,
//       phoneNumber: number.phoneNumber,
//       accountSid: number.accountSid,
//       smsUrl: number.smsUrl,
//       statusCallback: number.statusCallback
//     })
//   })
// }

// function * purchaseNewNumber () {
//   console.log('purchaseNewNumber')
//   const availablePhoneNumbers = yield client.availablePhoneNumbers('US').local.list({
//     excludeAllAddressRequired: 'true',
//   })
//   const number = availablePhoneNumbers[0]
//   const phoneNumber = number.phoneNumber
//   const purchasedNumber = yield client.incomingPhoneNumbers.create({
//     phoneNumber: phoneNumber,
//   })
//   console.log(purchasedNumber)
//   incomingPhoneNumbers.push(phoneNumber)
//   return phoneNumber
// }

// function * checkNumber (phoneNumber) {
//   let valid
//   const db = admin.firestore()
//   try {
//     const userSN = yield db.collection('users').doc(phoneNumber).get()
//     if (!userSN.exists || userSN.empty) return true
//     valid = userSN.data().valid
//     if (valid) return true
//     if (valid === false) return false
//     const response = yield client.lookups.v1
//       .phoneNumbers(phoneNumber)
//       .fetch({type: 'carrier'})
//     if (response && response.carrier) {
//       valid = response.carrier.type === 'mobile'
//     } else {
//       valid = false
//     }
//   } catch (e) {
//     console.log(e.message)
//     valid = false
//   }
//   db.collection('users').doc(phoneNumber).update({
//     valid
//   })
//   return valid
// }

async function sendMessage (message) {
  try {
    const res = await client.messages.create(message)
    if (res && res.sid) {
      return res.sid
    }
  } catch (e) {
    console.log(e.message)
  }
  return null
}

export default {
  sendMessage,
  client
}
