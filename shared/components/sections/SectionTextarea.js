import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { fontSize, getHeight } from 'shared/utils/dynamicSize'

import { REGULAR_FONT } from 'constants/index'
import { LIGHT_NAVY } from 'shared/constants/colors'

const StyledSectionTextarea = styled.TextInput`
  font-family: ${REGULAR_FONT};
  font-size: ${props => fontSize(14, props.viewport)};
  color: ${LIGHT_NAVY};
  padding-vertical: ${props => getHeight(10, props.viewport)};
  width: 100%;
  height: ${props => getHeight(props.height || 120, props.viewport)};
`

const SectionTextarea = (props) => (
  <StyledSectionTextarea
    multiline
    {...props}
  />
)

SectionTextarea.defaultProps = {
  autoCorrect: false,
  underlineColorAndroid: 'rgba(0,0,0,0)',
  autoCapitalize: 'none',
  textAlignVertical: 'top'
}

SectionTextarea.propTypes = {
  autoCorrect: PropTypes.bool,
  underlineColorAndroid: PropTypes.string,
  autoCapitalize: PropTypes.string,
  textAlignVertical: PropTypes.string
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SectionTextarea)
