import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

import { fontSize, getWidth } from 'shared/utils/dynamicSize'
import { NAV_BAR_HEIGHT, ACTIVE_OPACITY } from 'constants/index'
import { LIGHT_NAVY, AQUA_MARINE, BROWN_GREY } from 'shared/constants/colors'
import BackButton from 'shared/components/navbar/BackButton'
import { StyledText, Dot } from 'shared/components/StyledComponents'
import IconMoreInfo from 'shared/icons/MoreInfo'

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: ${props => fontSize(NAV_BAR_HEIGHT, props.viewport)};
`
const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`

const ProjectPageTitle = (props) => {
  const { viewport, onPress, title } = props
  return (
    <TitleContainer viewport={viewport}>
      <BackButton />
      <TouchableOpacity
        activeOpacity={ACTIVE_OPACITY}
        onPress={onPress}
      >
        <Row>
          <Dot color={AQUA_MARINE} size={fontSize(6, viewport)} />
          <StyledText
            fontSize={18}
            color={LIGHT_NAVY}
            customStyle={`margin-horizontal: ${getWidth(5, viewport)}`}
          >
            {title}
          </StyledText>
          <IconMoreInfo
            size={fontSize(18, viewport)}
            color={BROWN_GREY}
          />
        </Row>
        <StyledText
          fontSize={10}
          color={BROWN_GREY}
          customStyle='opacity: 0.58'
        >
          tap here for project info
        </StyledText>
      </TouchableOpacity>
    </TitleContainer>
  )
}

ProjectPageTitle.propTypes = {
  onPress: PropTypes.func
}

export default ProjectPageTitle
