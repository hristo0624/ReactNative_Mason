
export async function saveImage (storageRef, storagePath, base64Data, onProgress = () => null) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      resolve(xhr.response)
    }
    xhr.onerror = function (e) {
      reject(new TypeError('Network request failed'))
    }
    xhr.responseType = 'blob'
    xhr.open('GET', base64Data, true)
    xhr.send(null)
  })
  const uploadTask = storageRef.child(storagePath).put(blob)
  if (onProgress) {
    uploadTask.on('state_changed', snapshot => onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
  }
  const snapshot = await uploadTask
  const url = await snapshot.ref.getDownloadURL()
  return url
}


export default {
  saveImage
}