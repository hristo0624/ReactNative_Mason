import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'
import _ from 'lodash'

import { getHeight, getWidth, fontSize } from 'shared/utils/dynamicSize'
import StatusIcon from 'pages/projects/StatusIcon'
import { ACTIVE_OPACITY } from 'constants/index'
import { BLACK10, DUSK_TWO, LIGHT_GREY_BLUE } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import Avatar from 'shared/components/Avatar'

const Container = styled(TouchableOpacity)`
  height: ${props => getHeight(65, props.viewport)};
  flex-direction: row;
  border-bottom-width: 1;
  border-bottom-color: ${BLACK10};
`
const InfoContainer = styled(View)`
  flex: 1;
  margin-right: ${props => getWidth(10, props.viewport)};
  flex-direction: column;
  justify-content: center;
  margin-vertical: ${props => getHeight(6, props.viewport)};
`
const SpaceBetweenContainer = styled(View)`
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${props => props.customStyle || ''}
`
const AvatarContainer = styled(View)`
  flex: 1;
  align-items: flex-end;
`

const InfoItem = ({ address, cost, firstName, lastName, city, statusColor, statusTitle, viewport, onPress }) => {
  if (address.length > 27) address = `${address.substr(0, 24)}...`
  // if (desc.length > 27) desc = `${desc.substr(0, 24)}...`
  return (
    <Container
      viewport={viewport}
      activeOpacity={ACTIVE_OPACITY}
      onPress={onPress}
    >
      <StatusIcon
        color={statusColor}
        title={statusTitle}
      />
      <InfoContainer viewport={viewport}>
        <SpaceBetweenContainer>
          <StyledText
            color={DUSK_TWO}
            fontSize={16}
            customStyle={'flex: 2.2;'}
          >
            {address}
          </StyledText>
          <StyledText
            color={DUSK_TWO}
            customStyle={'text-align: right; flex: 1;'}
            fontSize={18}
          >
            {moneyWithSymbolAbbr(cost, null, null, 0)}
          </StyledText>
        </SpaceBetweenContainer>
        <SpaceBetweenContainer>
          <SpaceBetweenContainer customStyle='flex: 4;'>
            <StyledText
              color={DUSK_TWO}
              fontSize={12}
              customStyle={'flex: 1;'}
            >
              {city}
            </StyledText>
            <StyledText
              color={LIGHT_GREY_BLUE}
              customStyle={'text-align: right; flex: 1.5;'}
              fontSize={10}
            >
              {`${_.upperCase(firstName)} ${_.upperCase(lastName)}`}
            </StyledText>
          </SpaceBetweenContainer>
          <AvatarContainer>
            <Avatar
              color={DUSK_TWO}
              size={fontSize(20, viewport)}
              initials={`${_.get(firstName, 0, '')}${_.get(lastName, 0, '')}`}
            />
          </AvatarContainer>
        </SpaceBetweenContainer>
      </InfoContainer>
    </Container>
  )
}

InfoItem.propTypes = {
  address: PropTypes.string,
  cost: PropTypes.number,
  name: PropTypes.string,
  desc: PropTypes.string,
  statusColor: PropTypes.string,
  statusTitle: PropTypes.string,
  onPress: PropTypes.func
}

export default connect(state => ({ viewport: state.viewport }))(InfoItem)
