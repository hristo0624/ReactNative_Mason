import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import Checkbox from 'shared/components/Checkbox'
import CloseButton from 'shared/components/navbar/CloseButton'
import { StyledText } from 'shared/components/StyledComponents'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'

import img from 'assets/images/illustration.png'
import { WHITE, AQUA_MARINE } from 'shared/constants/colors'

const StyledImage = styled.Image`
  width: ${props => getHeight(225, props.viewport)};
  height: ${props => getHeight(179, props.viewport)};
  margin-top: ${props => getHeight(19, props.viewport)};
  align-self: center;
`
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => getHeight(24, props.viewport)};
`
const ItemsWrapper = styled.View`
  flex-direction: column;
  margin-top: ${props => getHeight(40, props.viewport)};
  margin-bottom: ${props => getHeight(30, props.viewport)};
  margin-horizontal: ${props => getWidth(24, props.viewport)};
`

class HowItWorks extends Component {
  continue = async () => {
    console.log('continue')
  }

  renderItem = (text, key) => {
    const { viewport } = this.props
    return (
      <Row key={key} viewport={viewport}>
        <Checkbox checked />
        <StyledText
          color={WHITE}
          fontSize={16}
          customStyle={`margin-left: ${getWidth(16, viewport)};`}>
          {text}
        </StyledText>
      </Row>
    )
  }

  render () {
    const { viewport } = this.props
    return (
      <Page
        backgroundColor={AQUA_MARINE}
        statusBarStyle='light-content'
      >
        <NavBar
          hideBorder
          backgroundColor='transparent'
          rightButton={<CloseButton color={WHITE} />}
        />
        <StyledImage
          viewport={viewport}
          source={img}
          resizeMode='cover'
        />
        <StyledText
          color={WHITE}
          fontSize={24}
          regular
          customStyle={`
            margin-top: ${getHeight(25, viewport)};
            margin-horizontal: ${getWidth(35, viewport)};
            align-self: center;
            text-align: center;
          `}
        >
          We pay for your supplies, no out of pocket
        </StyledText>

        <ItemsWrapper viewport={viewport}>
          {[
            'Find supplies you need in this app',
            'Exclusive, unbeatable discounts',
            'Order instantly, no out of pocket',
            'Low 1.75% fee'
          ].map(this.renderItem)}
        </ItemsWrapper>

        <PrimaryButton
          onPress={this.continue}
          title='See how it works'
          customStyle={`
            position: absolute;
            bottom: ${getHeight(70, viewport)};
            left: ${getWidth(40, viewport)};
            right: ${getWidth(40, viewport)};
            padding-horizontal: ${getWidth(20, viewport)};
            border-radius: ${getHeight(4, viewport)};
          `}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(HowItWorks)
