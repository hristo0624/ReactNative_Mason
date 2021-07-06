import _ from 'lodash'
import generate from 'firebase-auto-ids'

import { ref, auth } from 'constants/firebase'
import { receiveReferences } from 'model/actions/referencesAC'
import store from 'model/store'
import * as roles from 'constants/roles'
import config from 'config'
import { makeProposalInfo } from 'shared/controllers/proposal'
import headers from 'shared/controllers/headers'
import { saveImage } from 'controllers/storage'

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

export async function saveProposal (accountId, proposal) {
  try {
    console.log('save proposal')
    _.set(proposal, 'createdAt', _.now())
    await ref.child(`/proposals/${accountId}/${proposal.id}`).set(proposal)
    const proposalInfo = makeProposalInfo(proposal)
    await ref.child(`/accounts/${accountId}/proposalsInfo/${proposal.id}`).set(proposalInfo)
    return `${config.proposalUrl}/${accountId}/${proposal.id}`
  } catch (e) {
    console.log('save proposal error:', e.message)
    return null
  }
}

export function sendProposal (accountId, proposalId) {
  return async function (dispatch, getState) {
    try {
      const currentUser = auth.currentUser
      const authToken = await currentUser.getIdToken()
      const body = {
        authToken,
        accountId,
        proposalId
      }
      console.log('sendProposal, body', body)
      const url = `${config.dynamicUrl}/proto/sendProposal`
      console.log('post to url ', url, 'body', body)
      const response = await fetch(url,
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify(body)
        }
      )
      const answer = await response.json()
      console.log('sendInvite answer', answer)
    } catch (e) {
      console.log('save proposal error:', e.message)
    }
    return null
  }
}

export async function updateCompany (params) {
  const state = store.getState()
  const { user } = state
  const currentAccountId = _.get(user, 'currentAccountId')
  console.log('updateCompany params')
  if (currentAccountId) {
    await ref.child(`accounts/${currentAccountId}/company`).update(params)
  }
}

export async function deleteProposal (proposalId) {
  const state = store.getState()
  const accountId = _.get(state, 'user.currentAccountId')
  const hasRights = _.get(state, ['user', 'accounts', accountId, 'role']) === roles.OWNER
  if (hasRights) {
    await ref.child(`/proposals/${accountId}/${proposalId}`).set(null)
    await ref.child(`/accounts/${accountId}/proposalsInfo/${proposalId}`).set(null)
  } else {
    console.log('User has not rights to delete proposal')
  }
}

export async function fetchProposal (proposalId) {
  const state = store.getState()
  const accountId = _.get(state, 'user.currentAccountId')
  const hasRights = _.get(state, ['user', 'accounts', accountId, 'role']) === roles.OWNER
  if (hasRights) {
    const sn = await ref.child(`/proposals/${accountId}/${proposalId}`).once('value')
    return sn.val()
  } else {
    console.log('User has not rights to fetch proposal')
    return null
  }
}

export function editPermission (roleId, permId, value) {
  return async function (dispatch, getState) {
    const state = getState()
    const accountId = _.get(state, 'user.currentAccountId')
    await ref.child(`accounts/${accountId}/roles/${roleId}/permissions/${permId}`).set(value)
  }
}

export function saveRole (role) {
  return async function (dispatch, getState) {
    const state = getState()
    const accountId = _.get(state, 'user.currentAccountId')
    const roleId = generate(_.now())
    await ref.child(`accounts/${accountId}/roles/${roleId}`).set(role)
  }
}

export async function getLineItems (accountId) {
  try {
    console.log('Get lineItems')
    const lineItemsSnapshot = await ref.child(`lineItems/${accountId}`).once('value')
    const data = lineItemsSnapshot.val()
    console.log('data', data)
    return _.keys(data)
      .map(lineItemKey => data[lineItemKey].name)
      .map(lineItemValue => ({ value: lineItemValue, label: lineItemValue }))
  } catch (e) {
    console.log('Get lineItems error:', e.message)
    return null
  }
}

export function saveProfile (profile) {
  return async function (dispatch, getState) {
    const state = getState()
    const userId = _.get(state, 'user.id')
    console.log('save profile', profile)
    const curAvatar = _.get(state, 'user.profile.avatar')
    if (!_.isNil(profile.avatar) && curAvatar !== profile.avatar) {
      const newAvatar = await saveImage(`user/${userId}/avatar`, profile.avatar)
      const newAvatarSmall = await saveImage(`user/${userId}/avatarSmall`, profile.avatarSmall)
      const profileWithNewAvatars = {
        ...profile,
        avatar: newAvatar,
        avatarSmall: newAvatarSmall
      }
      await ref.child(`users/${userId}/profile`).update(profileWithNewAvatars)
    } else {
      await ref.child(`users/${userId}/profile`).update(profile)
    }
  }
}
