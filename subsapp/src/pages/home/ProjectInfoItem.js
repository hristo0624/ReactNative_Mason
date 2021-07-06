import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import Avatar from 'shared/components/Avatar'
import Chevron from 'shared/components/Chevron'

import { WHITE, BLACK10, AQUA_MARINE, DUSK_TWO, BROWN_GREY, LIGHT_NAVY } from 'shared/constants/colors'
import { ACTIVE_OPACITY } from 'constants/index'
import StatusIcon from 'pages/home/StatusIcon'
import TimerTrigger from 'shared/components/TimerTrigger'

const RowContainer = styled(TouchableOpacity)`
  width: 100%;
  height: ${props => getHeight(65, props.viewport)};
  background-color: ${WHITE};
  border-bottom-width: 1;
  border-top-width: ${props => props.index === 0 ? 1 : 0};
  border-color: ${BLACK10};
  flex-direction: row;
`
const InfoContainer = styled(View)`
  flex: 1;
  margin-right: ${props => getWidth(10, props.viewport)};
  flex-direction: column;
  justify-content: center;
  margin-vertical: ${props => getHeight(6, props.viewport)};
`
const AddressContainer = styled(View)`
  flex-direction: row;
  align-items: baseline;
`
const ActivityContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`


const ProjectInfoItem = (props) => {
  const { project, viewport, index, onPress, messages, typing, user } = props
  const projectMessages = _.values(_.get(messages, project.id), {})
  const sortedMessages = _.orderBy(projectMessages, ['timestamp'], ['desc'])
  const lastMessage = _.get(sortedMessages, [0, 'text'], '(empty)')
  // console.log('renderProjectInfoItem', project)

  let typingTime = 0
  let typingUserName = ''
  const projectTyping = _.get(typing, project.id, {})
  for (const uid in projectTyping) {
    if (uid !== user.id) {
      const t = projectTyping[uid]
      if (t > typingTime) {
        typingTime = t
      }
    }
  }

  return (
    <RowContainer
      viewport={viewport}
      index={index}
      activeOpacity={ACTIVE_OPACITY}
      onPress={onPress}
    >
      <StatusIcon
        title={'In progress'}
        color={AQUA_MARINE}
      />
      <InfoContainer viewport={viewport}>
        <AddressContainer>
          <StyledText
            color={DUSK_TWO}
            customStyle='flex: 2'
          >
            {_.get(project, 'projectInfo.address.name', '')}
          </StyledText>
          <StyledText
            color={BROWN_GREY}
            fontSize={10}
            customStyle='flex: 1'
          >
            {_.get(project, 'projectInfo.address.city', '')}
          </StyledText>
        </AddressContainer>

        <ActivityContainer>
          <TimerTrigger
            timestamp={typingTime}
            componentActive={<StyledText color={BROWN_GREY} fontSize={14}>{'User is typing...'}</StyledText>}
            componentInactive={<StyledText color={BROWN_GREY} fontSize={14}>{lastMessage}</StyledText>}
          />
          <Avatar
            size={14}
            color='red'
            initials={'PM'}
          />
        </ActivityContainer>
      </InfoContainer>
      <Chevron
        customStyle={`align-self: center;`}
      />
    </RowContainer>
  )
}

ProjectInfoItem.propTypes = {
  project: PropTypes.object,
  viewport: PropTypes.object,
  index: PropTypes.number,
  onPress: PropTypes.func
}

const mapStateToProps = state => ({
  messages: state.messages,
  typing: state.typing,
  user: state.user
})

export default connect(mapStateToProps)(ProjectInfoItem)