import * as types from 'model/actionTypes'

const initialState = null

export default function (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_ACCOUNT:
      return action.account
    case types.RECEIVE_ACCOUNT_ADMINS:
      return {
        ...state,
        admins: action.admins
      }
    case types.RECEIVE_ACCOUNT_COMPANY:
      return {
        ...state,
        company: action.company
      }
    case types.RECEIVE_ACCOUNT_CONTACTS:
      return {
        ...state,
        contacts: action.contacts
      }
    case types.RECEIVE_ACCOUNT_CREATEDAT:
      return {
        ...state,
        createdAt: action.createdAt
      }
    case types.RECEIVE_ACCOUNT_ID:
      return {
        ...state,
        id: action.id
      }
    case types.RECEIVE_ACCOUNT_PROJECTS_INFO:
      return {
        ...state,
        projectsInfo: action.projectsInfo
      }
    case types.RECEIVE_ACCOUNT_PROPOSALS_INFO:
      return {
        ...state,
        proposalsInfo: action.proposalsInfo
      }
    case types.RECEIVE_ACCOUNT_ROLES:
      return {
        ...state,
        roles: action.roles
      }
    case types.CLEAR:
      return initialState
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
