import { firebase } from '@firebase/app'
import '@firebase/database'
import config from '../../../webapp/src/config'

// firebase.database.enableLogging(true, true)
export const app = firebase.initializeApp(config)
export const ref = firebase.database().ref()
