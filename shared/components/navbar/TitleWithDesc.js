import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { DEFAULT_FONT, TITLE_FONT_SIZE } from 'constants/index'
import styled from 'styled-components'
import { fontSize } from 'shared/utils/dynamicSize'
import { NAVBAR_FONT, STEEL } from 'shared/constants/colors'

const TitleContainer = styled.View`
  align-items: center;
`
const Title = styled.Text`
  font-family: ${DEFAULT_FONT};
  font-size: ${props => fontSize(TITLE_FONT_SIZE, props.viewport)};
  color: ${NAVBAR_FONT};
  ${props => props.customStyle}
`
const Desc = styled.Text`
  font-family: ${DEFAULT_FONT};
  font-size: ${props => fontSize(TITLE_FONT_SIZE * 0.8, props.viewport)};
  color: ${STEEL};
  ${props => props.customStyle}
`

const TitleWithDesc = ({ title, desc, titleCustomStyle, descCustomStyle, viewport }) => (
  <TitleContainer>
    <Title viewport={viewport} customStyle={titleCustomStyle}>{title}</Title>
    <Desc viewport={viewport} customStyle={descCustomStyle}>{desc}</Desc>
  </TitleContainer>
)

TitleWithDesc.propsTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  titleCustomStyle: PropTypes.string,
  descCustomStyle: PropTypes.string
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(TitleWithDesc)