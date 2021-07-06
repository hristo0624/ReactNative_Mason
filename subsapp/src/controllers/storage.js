import { storageRef } from 'constants/firebase'
import storage from 'shared/controllers/storage'

export function saveImage (storagePath, base64Data, onProgress) {
  return storage.saveImage(storageRef, storagePath, base64Data, onProgress)
}

export function  deleteFile (storagePath) {
  return async function (dispatch, getState) {
    try {
      await storageRef.child(storagePath).delete()
    } catch (e) {
      console.log('storage delete file error', e)
    }
  }
}