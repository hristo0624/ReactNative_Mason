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
  console.log('upload sig to', p)
  const uploadTask = storageRef.child(p).putString(sigBase64, 'data_url')
  if (onProgress) {
    uploadTask.on('state_changed', snapshot => onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
  }
  const snapshot = await uploadTask
  const url = await snapshot.ref.getDownloadURL()
  await ref.child(`users/${uid}/signature`).set(url)
  return url
}
