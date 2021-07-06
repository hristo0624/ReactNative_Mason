import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'

import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'

import { LIGHT_NAVY } from 'shared/constants/colors'

class CurrentProjects extends Component {
  render () {
    const { viewport } = this.props
    return (
      <View>
        <StyledText
          fontSize={20}
          color={LIGHT_NAVY}
          letterSpacing={0.05}
          customStyle={
            `margin-bottom: ${getHeight(15, viewport)};
            margin-left: ${getWidth(14, viewport)}`
          }
        >
          Current projects
        </StyledText>
      </View>
    )
  }
}


export default connect(state => ({ viewport: state.viewport }))(CurrentProjects)
