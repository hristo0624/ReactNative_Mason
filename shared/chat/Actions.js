/* eslint-disable no-underscore-dangle, no-use-before-define */

import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'

import { getWidth } from 'shared/utils/dynamicSize'
import ActionIcon from 'shared/chat/ActionIcon'

const Container = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-horizontal: ${props => getWidth(10, props.viewport)};
  margin-vertical: ${props => getWidth(10, props.viewport)};
`

export default class Actions extends React.Component {

  render() {
    const { actionIcons, viewport } = this.props
    const component = actionIcons.map((iconComponent) => {
      return <ActionIcon 
              icon={iconComponent.icon}
              onPress={iconComponent.onPress}
              viewport={viewport}
              key={iconComponent.icon}
            />
    })
    return (
      <Container viewport={viewport} >          
        {component}
      </Container>
    )
  }

}

Actions.defaultProps = {
  actionIcons: []
}

Actions.propTypes = {
  actionIcons: PropTypes.array
}