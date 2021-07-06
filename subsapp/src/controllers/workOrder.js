import { ref, auth, storageRef } from 'constants/firebase'
import _ from 'lodash'
import { saveImage } from 'shared/controllers/storage'

export function sendBid (bid) {
  return async function (dispatch, getState) {
    console.log('send bid controller', bid)
    const authUser = auth.currentUser
    // let files = _.get(bid, 'files', null)
    // if (!_.isNil(files)) {
    //   files = await Promise.all(_.map(files, f => ))
    // }
    const dbBid = {
      timestamp: _.now(),
      files: _.get(bid, 'files', null),
      items: _.get(bid, 'items', null),

    }
    await ref.child(`workOrders/${bid.workOrderId}/members/${authUser.uid}/bid`).set(dbBid)
  }
}

export function updateDraft (draftId, data, draftPath = '') {
  return async function (dispatch, getState) {
    const authUser = auth.currentUser
    await ref.child(`users/${authUser.uid}/drafts/${draftId}/${draftPath}`).update(data)
  }
}
