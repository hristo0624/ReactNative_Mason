import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import ElevatedView from 'react-native-elevated-view'

import { getHeight, getWidth } from 'shared/utils/dynamicSize'

const Card = ({ viewport, height, width, children }) => (
  <ElevatedView
    elevation={4}
    style={{
      height: getHeight(height, viewport),
      width: getWidth(width, viewport),
      backgroundColor: 'white',
      borderRadius: 6,
      padding: getHeight(12, viewport),
      marginVertical: getHeight(12, viewport)
    }}
  >
    {children}
  </ElevatedView>
)

export default connect(state => ({ viewport: state.viewport }))(Card)
