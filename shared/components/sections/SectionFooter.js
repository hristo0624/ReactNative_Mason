import { connect } from 'react-redux'
import styled from 'styled-components'

import { getWidth, getHeight } from 'shared/utils/dynamicSize'

const SectionFooter = styled.View`
  margin-horizontal: ${props => getWidth(14, props.viewport)};
  margin-vertical: ${props => getHeight(12, props.viewport)};
`

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SectionFooter)
