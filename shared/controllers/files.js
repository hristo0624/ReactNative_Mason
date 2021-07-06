import { Platform } from 'react-native'
import * as Permissions from 'expo-permissions'
import _ from 'lodash'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import generate from 'firebase-auto-ids'


export async function browseFiles () {
  console.log('browse files')
  let hasPermission = Platform.OS !== 'ios'
  if (Platform.OS === 'ios') {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL)
    console.log('CAMERA_ROLL status', status)
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      hasPermission = status === 'granted'
    } else {
      hasPermission = true
    }
  }
  if (hasPermission) {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6
    }
    const res = await ImagePicker.launchImageLibraryAsync(options)
    console.log('ImagePicker res', res)
    const cancelled = _.get(res, 'cancelled')
    if (cancelled === false) {
      const actions = [{
        resize: {
          width: 50,
          height: 50
        }
      }]
      const outputOptions = {
        compress: 1,
        format: ImageManipulator.SaveFormat.PNG
      }
      const uri = _.get(res, 'uri', null)
      const manipResult = await ImageManipulator.manipulateAsync(uri, actions, outputOptions)
      const fileId = generate(_.now())
      return {
        id: fileId,
        url: uri,
        thumbUrl: _.get(manipResult, 'uri', null)
      }
    }
  }
  return null
}