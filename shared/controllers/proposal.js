import _ from 'lodash'

export function makeProposalInfo (proposal) {
  return {
    id: _.get(proposal, 'id'),
    address: _.get(proposal, 'address'),
    owner: {
      firstName: _.get(proposal, 'owner.firstName', null),
      lastName: _.get(proposal, 'owner.lastName', null)
    },
    status: 'new',
    projectCost: _.get(proposal, 'projectCost'),
    admins: _.get(proposal, 'admins', null),
    createdAt: _.get(proposal, 'createdAt', null)
  }
}
