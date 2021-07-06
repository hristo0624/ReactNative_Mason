import React from 'react'
import _ from 'lodash'

import { LIGHT_NAVY, AQUA_MARINE } from 'shared/constants/colors'
import InfoItem from 'pages/projects/InfoItem'

const ProjectInfoItem = ({ projectInfo, onPress }) => {
  const isCompleted = true
  return (
    <InfoItem
      address={_.get(projectInfo, 'name', _.get(projectInfo, 'address.name', ''))}
      cost={_.get(projectInfo, 'projectCost', 0)}
      firstName={_.get(projectInfo, 'owner.firstName', '')}
      lastName={_.get(projectInfo, 'owner.lastName', '')}
      city={_.get(projectInfo, 'address.city', '')}
      avatar={_.get(projectInfo, 'owner.avatar')}
      statusColor={isCompleted ? LIGHT_NAVY : AQUA_MARINE}
      statusTitle={isCompleted ? 'Complete' : 'In progress'}
      onPress={onPress}
    />
  )
}

export default ProjectInfoItem
