import { Permissions, ImagePicker } from 'expo'

async function getPermission (permission) {
  const { status: existingStatus } = await Permissions.getAsync(permission)
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(permission)
    finalStatus = status
  }
  return (finalStatus === 'granted')
}

export async function loadImage (onResult, quality = 0.5) {
  const cameraRollGranted = await getPermission(Permissions.CAMERA_ROLL)
  if (cameraRollGranted) {
    let result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      quality
    })
    onResult(result)
  } else {
    onResult({ error: { cameraRollGranted } })
  }
}

export async function takePhoto (onResult, quality = 0.5) {
  const cameraRollGranted = await getPermission(Permissions.CAMERA_ROLL)
  const cameraGranted = await getPermission(Permissions.CAMERA)
  if (cameraGranted && cameraRollGranted) {
    let result = await ImagePicker.launchCameraAsync({
      base64: true,
      allowsEditing: true,
      quality
    })
    onResult(result)
  } else {
    onResult({ error: { cameraGranted, cameraRollGranted } })
  }
}

export function getSource ({ uri, base64 }) {
  const fileType = uri ? uri.split('.')[uri.split('.').length - 1] : null
  const source = `data:image/${fileType};base64,${base64}`
  return source
}

export function uriToBlob (uri) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onerror = reject
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response)
      }
    }
    xhr.open('GET', uri)
    xhr.responseType = 'blob'
    xhr.send()
  })
}
