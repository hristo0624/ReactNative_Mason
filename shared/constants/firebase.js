import * as firebase from 'firebase'
import config from 'config'

firebase.initializeApp(config)

export const auth = firebase.auth()
export const storage = firebase.storage()
export const storageRef = storage.ref()
export const ref = firebase.database().ref()