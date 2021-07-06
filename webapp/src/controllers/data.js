import _ from 'lodash'
import { auth, ref } from 'constants/firebase'
import { receiveReferences } from 'model/actions/referencesAC'
import store from 'model/store'
import * as roles from 'constants/roles'
import config from 'src/config'
import { makeProposalInfo } from 'shared/controllers/proposal'

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

export async function deleteLineItem (accountId, lineItemKey) {
  try {
    console.log('Get lineItems', `lineItems/${accountId}/${lineItemKey}`)
    await ref.child(`lineItems/${accountId}/${lineItemKey}`).remove()
  } catch (e) {
    console.log('Delete lineItems error:', e.message)
    return null
  }
}

export async function saveProposal (accountId, proposal) {
  try {
    _.set(proposal, 'createdAt', _.now())

    const proposalLineItems = proposal.lineItems
    const currentLineItemsSN = await ref.child(`lineItems/${accountId}`).once('value')
    const currentLineItems = currentLineItemsSN.val()

    const lineItemsToAdd = _.omitBy(proposalLineItems,
      ({ name }) => _.keys(currentLineItems).find(key => currentLineItems[key].name === name))

    const cleanLineItemsToAdd = {}
    _.keys(lineItemsToAdd)
      .forEach((key) => {
        cleanLineItemsToAdd[key] = { name: lineItemsToAdd[key].name, id: key }
      })

    console.log('proposal', proposal)

    await ref.child(`/proposals/${accountId}/${proposal.id}`).set(proposal)
    const proposalInfo = makeProposalInfo(proposal)
    console.log('proposalInfo', proposalInfo)
    await ref.child(`/lineItems/${accountId}/`).update(cleanLineItemsToAdd)
    await ref.child(`/accounts/${accountId}/proposalsInfo/${proposal.id}`).set(proposalInfo)
    return `${config.proposalUrl}/${accountId}/${proposal.id}`
  } catch (e) {
    console.log('save proposal error:', e.message)
    return null
  }
}

export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
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
