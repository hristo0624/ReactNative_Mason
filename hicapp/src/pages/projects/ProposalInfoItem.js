import React from 'react'
import _ from 'lodash'

import { LIGHT_NAVY, AQUA_MARINE, DEEP_SKY_BLUE } from 'shared/constants/colors'
import InfoItem from 'pages/projects/InfoItem'
import proposalStatuses from 'constants/proposalStatuses'

const ProposalInfoItem = ({ proposalInfo, onPress }) => {
  let statusColor = LIGHT_NAVY
  const status = _.get(proposalInfo, 'status')
  if (status === proposalStatuses.NEW) statusColor = AQUA_MARINE
  if (status === proposalStatuses.ACCEPTED) statusColor = DEEP_SKY_BLUE
  return (
    <InfoItem
      address={_.get(proposalInfo, 'name', _.get(proposalInfo, 'address.name', ''))}
      cost={_.get(proposalInfo, 'projectCost', 0)}
      firstName={_.get(proposalInfo, 'owner.firstName', '')}
      lastName={_.get(proposalInfo, 'owner.lastName', '')}
      city={_.get(proposalInfo, 'address.city', '')}
      avatar={_.get(proposalInfo, 'owner.avatar')}
      statusColor={statusColor}
      statusTitle={_.get(proposalInfo, 'status', '')}
      onPress={onPress}
    />
  )
}

export default ProposalInfoItem
