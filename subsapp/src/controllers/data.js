import _ from 'lodash'
import { ref } from 'constants/firebase'
import { receiveReferences } from 'model/actions/referencesAC'

export function fetchReferences () {
  return async function (dispatch, getState) {
    try {
      await ref.child('references').on('value', referencesSN => {
        const references = referencesSN.val() || {}
        dispatch(receiveReferences(references))
      })
    } catch (e) {
      console.log('fetchReferences error:', e.message)
    }
  }
}