import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import config from 'config'

firebase.initializeApp(config)

export const auth = firebase.auth()
export const storage = firebase.storage()
export const storageRef = storage.ref()
export const db = firebase.firestore()
export const ref = firebase.database().ref()
