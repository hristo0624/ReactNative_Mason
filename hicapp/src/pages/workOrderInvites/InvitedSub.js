import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import moment from 'moment-timezone'
import _ from 'lodash'

import { StyledText, Dot } from 'shared/components/StyledComponents'
import { LIGHT_NAVY, LIGHT_GREY_BLUE, LIGHT_BLUE_GREY, MANGO, PALE_BLUE, WHITE, CORAL } from 'shared/constants/colors'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import { fontSize, getWidth } from 'shared/utils/dynamicSize'
import { stringDiffHours } from 'utils/date'
import IconPlus from 'shared/icons/Plus'
import { ACTIVE_OPACITY } from 'constants/index'
import IconChat from 'shared/icons/Chat'
import TimerTrigger from 'shared/components/TimerTrigger'

const Container = styled(View)`
  flex-direction: row;
`
const StyledView = styled(View)`
  ${props => props.customStyle}
`
const CloseButton = styled(TouchableOpacity)`
  /* margin-left: ${props => getWidth(5, props.viewport)}; */
  width: ${props => fontSize(24, props.viewport)};
  height: ${props => fontSize(24, props.viewport)};
  border-radius: ${props => fontSize(12, props.viewport)};
  align-items: center;
  justify-content: center;
  background-color: ${CORAL};
  transform: rotate(45deg);
  ${props => props.customStyle}
`

const InvitedSub = props => {
  const { name, lastMessage, bid, viewport, status, lastActivityTime, onPressDelete, typingTime } = props
  console.log('typingTime', typingTime)
  const message = lastMessage.length > 30 ? `${lastMessage.substr(0, 27)}...` : lastMessage
  return (
    <Container>
      <StyledView customStyle='flex: 8'>
        <StyledView customStyle='flex-direction: row;'>
          <StyledText
            color={LIGHT_NAVY}
            customStyle={`margin-right: ${getWidth(5, viewport)}`}
          >
            {name}
          </StyledText>
          <IconChat size={fontSize(17, viewport)} />
        </StyledView>
        <TimerTrigger
          timestamp={typingTime}
          componentActive={<StyledText fontSize={15} color={LIGHT_GREY_BLUE}>{'is typing...'}</StyledText>}
          componentInactive={<StyledText fontSize={15} color={LIGHT_GREY_BLUE}>{message}</StyledText>}
        />
      </StyledView>
      <StyledView customStyle='flex: 3; justify-content: center;'>
        { bid > 0
          ? <StyledView customStyle='flex-direction: row; align-items: baseline;'>
            <StyledText
              color={LIGHT_BLUE_GREY}
              fontSize={11}
              customStyle={`margin-right: ${getWidth(5, viewport)}`}
            >
              BID
            </StyledText>
            <StyledText fontSize={18} color={LIGHT_NAVY}>
              {moneyWithSymbolAbbr(bid, '$', null, 0)}
            </StyledText>
          </StyledView>
          : <StyledView customStyle='flex-direction: row; align-items: center;'>
            <Dot size={fontSize(5, viewport)} color={MANGO} />
            <StyledText
              fontSize={11}
              customStyle={`font-family: Lato-Light; margin-left: ${getWidth(5, viewport)}`}
              letterSpacing={1}
            >
              {_.upperCase(status)}
            </StyledText>
          </StyledView>
        }
        <StyledText
          fontSize={13}
          color={PALE_BLUE}
        >
          {stringDiffHours(moment(), moment(lastActivityTime))}
        </StyledText>
      </StyledView>
      <StyledView
        customStyle='
          flex: 1;
          align-items: center;
          justify-content: center;
        '
      >
        <CloseButton
          viewport={viewport}
          activeOpacity={ACTIVE_OPACITY}
          onPress={onPressDelete}
        >
          <IconPlus
            size={fontSize(18, viewport)}
            color={WHITE}
          />
        </CloseButton>
      </StyledView>
    </Container>
  )
}

InvitedSub.defaultProps = {
  lastMessage: '',
  bid: 0,
  status: 'invited'
}

InvitedSub.propTypes = {
  name: PropTypes.string,
  lastMessage: PropTypes.string,
  bid: PropTypes.number,
  lastActivityTime: PropTypes.number,
  onPressDelete: PropTypes.func,
  typingTime: PropTypes.number
}

export default InvitedSub
