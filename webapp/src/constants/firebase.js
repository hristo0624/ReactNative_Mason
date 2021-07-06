import { firebase } from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import '@firebase/storage'
import config from 'src/config'

// firebase.database.enableLogging(true, true)
export const app = firebase.initializeApp(config)
export const auth = app.auth()
export const ref = firebase.database().ref()
export const storageRef = firebase.storage().ref()
