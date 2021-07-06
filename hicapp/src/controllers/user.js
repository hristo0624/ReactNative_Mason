import generate from 'firebase-auto-ids'
import _ from 'lodash'
import { ref, auth, storageRef } from 'constants/firebase'

export async function switchAccount (accId) {
  const uid = auth.currentUser.uid
  await ref.child(`users/${uid}/currentAccountId`).set(accId)
}

export async function saveSignature (sigBase64, onProgress) {
  const uid = auth.currentUser.uid
  const sigId = generate(_.now())
  const p = `userSignatures/${uid}/${sigId}`
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      resolve(xhr.response)
    }
    xhr.onerror = function (e) {
      console.log(e)
      reject(new TypeError('Network request failed'))
    }
    xhr.responseType = 'blob'
    xhr.open('GET', sigBase64, true)
    xhr.send(null)
  })
  const uploadTask = storageRef.child(p).put(blob)
  if (onProgress) {
    uploadTask.on('state_changed', snapshot => onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
  }
  const snapshot = await uploadTask
  const url = await snapshot.ref.getDownloadURL()
  blob.close()
  await ref.child(`users/${uid}/signature`).set(url)
  return url
}

export function getUserProfile (userId) {
  const userProfilePath = `users/${userId}/profile`
  const rProfile = ref.child(userProfilePath)
  let profile = {}
  rProfile.on('value', sn => {
    profile = sn.val()
    console.log('get User Profile', userId)
  })
  return profile
}
