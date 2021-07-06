import { createSelector } from 'reselect'
import _ from 'lodash'

const getProjectId = (state) => _.get(state, 'project.id')
const getWorkOrders = (state) => _.get(state, 'workOrders')

export const getWorkOrdersForCurrentProject = createSelector(
  [ getProjectId, getWorkOrders ],
  (projectId, workOrders) => {
    const res = {}
    for (const woId in workOrders) {
      const wo = workOrders[woId]
      if (wo.projectId === projectId) {
        _.set(res, woId, wo)
      }
    }
    return res
  }
)
