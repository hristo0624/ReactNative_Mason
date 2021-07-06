import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { View } from 'react-native'

import Avatar from 'shared/components/Avatar'
import Chevron from 'shared/components/Chevron'
import { fontSize } from 'shared/utils/dynamicSize'

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
`

const PicWithChevron = ({ url, viewport, disabled, initials }) => (
  <Container>
    <Avatar
      size={fontSize(35, viewport)}
      url={url}
      initials={initials}
    />
    <Chevron name='chevron-right' disabled={disabled} />
  </Container>
)

export default connect(state => ({ viewport: state.viewport }))(PicWithChevron)
