import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import CameraIcon from 'shared/icons/Camera'
import SpeakerIcon from 'shared/icons/Speaker'
import PlusIcon from 'shared/icons/Plus'
import AddIcon from 'shared/icons/Add'
import ImageIcon from 'shared/icons/Image'
import { fontSize, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { WHITE, AQUA_MARINE } from '../constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'

const TouchableWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-left: ${props => getWidth(10, props.viewport)};
`
const Wrapper = styled.View`
  justify-content: flex-start;
  flex-direction: column;
  flex: 1;
`

const TitleWrapper = styled.View`
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  flex: 1;
`

const StyledIcon = styled(Ionicons)`
  margin-left: ${props => getWidth(8, props.viewport)};
  margin-right: ${props => getWidth(8, props.viewport)};
  color: ${WHITE};
`

export default class ActionIcon extends React.Component {

  onPress() {
  }

  renderTooltipContent() {
    const { tooltipTitle, tooltipContent, viewport } = this.props
    return (
      <Wrapper>
        <TitleWrapper>
          <StyledText
            fontSize={16}
            color={WHITE}
            bold
          >
            {tooltipTitle}
          </StyledText>
          <TouchableWrapper
            viewport={viewport}
            onPress={this.onPress}
          >
            <StyledIcon viewport={viewport} name='md-close' size={fontSize(20, viewport)} />
          </TouchableWrapper>
        </TitleWrapper>
        <StyledText
          fontSize={14}
          color={WHITE}
          bold
        >
          {tooltipContent}
        </StyledText>
      </Wrapper>
    )
  }

  render() {
    const { icon, viewport } = this.props
    let IconComponent
    switch (icon) {
      case 'Speaker':
        IconComponent = <SpeakerIcon size={fontSize(30, viewport)} color={AQUA_MARINE}/>
        break;
      case 'Plus':
        IconComponent = <PlusIcon size={fontSize(30, viewport)} color={AQUA_MARINE}/>
        break;
      case 'Add':
        IconComponent = <AddIcon size={fontSize(30, viewport)} color={AQUA_MARINE}/>
        break;
      case 'Camera':
        IconComponent = <CameraIcon width={fontSize(28, viewport)} height={fontSize(21, viewport)} color={AQUA_MARINE}/>
        break;
      case 'Image':
        IconComponent = <ImageIcon size={fontSize(22, viewport)} color={AQUA_MARINE}/>
        break;
      default:
        break;
    }

    return (
        <TouchableWrapper
          viewport={viewport}
          onPress={this.onPress}
        >
          {IconComponent}
        </TouchableWrapper>
    )
  }
}

ActionIcon.defaultProps = {
  icon: null,
  onPress: null
}

ActionIcon.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func
}