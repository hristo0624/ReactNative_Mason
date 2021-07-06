import * as types from 'model/actionTypes.js'

export function receiveAccount (account) {
  return {
    type: types.RECEIVE_ACCOUNT,
    account
  }
}

export function receiveAccountAdmins (admins) {
  return {
    type: types.RECEIVE_ACCOUNT_ADMINS,
    admins
  }
}

export function receiveAccountCompany (company) {
  return {
    type: types.RECEIVE_ACCOUNT_COMPANY,
    company
  }
}

export function receiveAccountContacts (contacts) {
  return {
    type: types.RECEIVE_ACCOUNT_CONTACTS,
    contacts
  }
}

export function receiveAccountCreatedAt (createdAt) {
  return {
    type: types.RECEIVE_ACCOUNT_CREATEDAT,
    createdAt
  }
}

export function receiveAccountId (id) {
  return {
    type: types.RECEIVE_ACCOUNT_ID,
    id
  }
}

export function receiveAccountProjectsInfo (projectsInfo) {
  return {
    type: types.RECEIVE_ACCOUNT_PROJECTS_INFO,
    projectsInfo
  }
}

export function receiveAccountProposalsInfo (proposalsInfo) {
  return {
    type: types.RECEIVE_ACCOUNT_PROPOSALS_INFO,
    proposalsInfo
  }
}

export function receiveAccountRoles (roles) {
  return {
    type: types.RECEIVE_ACCOUNT_ROLES,
    roles
  }
}
