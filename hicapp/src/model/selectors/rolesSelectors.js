import { createSelector } from 'reselect'
import _ from 'lodash'

const getReferencesRoles = (state) => _.get(state, 'references.roles', {})
const getAccountRoles = (state) => _.get(state, 'account.roles', {})

export const getRolesTitles = createSelector(
  [ getReferencesRoles, getAccountRoles ],
  (refRoles, acRoles) => {
    const res = {}
    for (const roleId in refRoles) {
      if (_.has(refRoles, [roleId, 'title'])) _.set(res, roleId, refRoles[roleId].title)
    }
    for (const roleId in acRoles) {
      if (_.has(acRoles, [roleId, 'title'])) _.set(res, roleId, acRoles[roleId].title)
    }

    // return object { owner: 'Owner', employee: 'Employee', ... }
    return res
  }
)
const getDefaultPermissions = (state) => {
  const permsDict = _.get(state, 'references.permissions', {})
  const res = {}
  for (const permId in permsDict) {
    _.set(res, permId, false)
  }
  return res
}

const getRefRolePermissions = (state, roleId) => _.get(state, ['references', 'roles', roleId, 'permissions'], {})
const getAccountRolePermissions = (state, roleId) => _.get(state, ['account', 'roles', roleId, 'permissions'], {})

export const getRolePermissions = createSelector(
  [ getDefaultPermissions, getRefRolePermissions, getAccountRolePermissions ],
  (defaultPermissions, refPermissions, acPermissions) => {
    // return object { createProposal: false, chat: false, ... }
    return {
      ...defaultPermissions,
      ...refPermissions,
      ...acPermissions
    }
  }
)
