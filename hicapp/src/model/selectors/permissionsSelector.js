import { createSelector } from 'reselect'
import _ from 'lodash'
import { getRolePermissions } from 'model/selectors/rolesSelectors'
import permissions from 'constants/permissions'

const getUser = (state) => _.get(state, 'user', {})

const getMyRole = createSelector(
  [getUser],
  user => {
    const curAccountId = _.get(user, 'currentAccountId')
    const roleId = _.get(user, ['accounts', curAccountId, 'role'])
    return roleId
  }
)

const getMyPermissions = state => {
  const roleId = getMyRole(state)
  return getRolePermissions(state, roleId)
}

export const getCreateProposalPermission = createSelector(
  [getMyPermissions],
  myPermissions => {
    return _.get(myPermissions, permissions.CREATE_ROPOSALS, false)
  }
)

export const getViewAllProjectPermission = createSelector(
  [getMyPermissions],
  myPermissions => {
    return _.get(myPermissions, permissions.VIEW_ALL_PROJECTS, false)
  }
)
