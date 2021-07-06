import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { View } from 'react-native'
import _ from 'lodash'

import { getHeight, fontSize, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'

import { LIGHT_GREY_BLUE, BLACK10, PALE_GREY } from 'shared/constants/colors'

const Container = styled(View)`
  height: ${props => getHeight(_.get(props, 'height', 48), props.viewport)};
  margin-top: ${props => props.isFirst ? getHeight(10, props.viewport) : 0};
  border-bottom-width: ${ props => props.noBorder ? 0 : 1};
  border-color: ${BLACK10};
  justify-content: space-between;
  align-items: flex-end;
  background-color: ${PALE_GREY};
  flex-direction: row;
  padding-bottom: ${props => getHeight(3, props.viewport)};
  padding-horizontal: ${props => getWidth(14, props.viewport)};
`

const Title = styled(StyledText)`
  font-size: ${props => fontSize(16, props.viewport)};
  letter-spacing: 0.44;
  color: ${LIGHT_GREY_BLUE};
`

const SectionHeader = ({ title, viewport, isFirst, height, noBorder, children }) => (
  <Container viewport={viewport} isFirst={isFirst} height={height} noBorder={noBorder}>
    <Title viewport={viewport} bold>{_.toUpper(title)}</Title>
    {children}
  </Container>
)

SectionHeader.propTypes = {
  title: PropTypes.string,
  isFirst: PropTypes.bool,
  height: PropTypes.number,
  noBorder: PropTypes.bool
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SectionHeader)
