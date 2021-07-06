import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Image } from 'react-native'

import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import { DUSK_TWO, ALMOST_BLACK } from 'shared/constants/colors'

const Wrapper = styled.View`
  flex: 1;
  margin-top: ${props => getHeight(60, props.viewport)};
  justify-content: flex-start;
  align-items: center;
  ${props => props.customStyle || ''}
`
const StyledImage = styled(Image)`
  width: ${props => getWidth(140, props.viewport)};
  height: ${props => getWidth(140, props.viewport)};
  margin-top: ${props => getHeight(30, props.viewport)};
  ${props => props.customStyle || ''}
`

class EmptyState extends Component {
  render () {
    const { viewport, imageSource, title,
      description, wrapperCustomStyle,
      imageCustomStyle, children
    } = this.props
    return (
      <Wrapper viewport={viewport} customStyle={wrapperCustomStyle}>
        <StyledText
          fontSize={27}
          color={ALMOST_BLACK}
          textAlign='center'
          letterSpacing={0.05}
          style={{ marginBottom: getHeight(15, viewport) }}
          bold
        >
          {title}
        </StyledText>
        { imageSource
          ? <StyledImage
            viewport={viewport}
            customStyle={imageCustomStyle}
            resizeMode='contain'
            source={imageSource}
          />
          : null
        }
        <StyledText
          fontSize={16}
          color={DUSK_TWO}
          textAlign='center'
          letterSpacing={0.44}
          regular
          customStyle={`
            padding-horizontal: 15%;
            margin-top: ${getHeight(30, viewport)}
          `}
        >
          {description}
        </StyledText>
        {children}
      </Wrapper>
    )
  }
}

EmptyState.propTypes = {
  viewport: PropTypes.object.isRequired,
  title: PropTypes.string,
  desc: PropTypes.string,
  imageCustomStyle: PropTypes.string,
  wrapperCustomStyle: PropTypes.string,
}

const mapStateToProps = (state, props) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(EmptyState)
