import { AsyncStorage } from 'react-native'

export async function storeData (key, data) {
  try {
    await AsyncStorage.setItem(key, data)
  } catch (e) {
    console.log('AsyncStorage storeData:', e.message)
  }
}

export async function retrieveData (key) {
  try {
    const data = await AsyncStorage.getItem(key)
    return data
  } catch (e) {
    console.log('AsyncStorage retrieveData:', e.message)
  }
}

export async function clear () {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.log('AsyncStorage clear:', e.message)
  }
}
