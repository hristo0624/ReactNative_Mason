import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import Logo from 'components/Logo'
import { StyledText } from 'shared/components/StyledComponents'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import { WHITE, AQUA_MARINE } from 'shared/constants/colors'
import { getWidth, fontSize } from 'shared/utils/dynamicSize'
import { trackEvent, category } from 'utils/analytics'

const Content = styled.View`
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex: 1;
`
const LogoContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex: 0.22;
`
const PromotionText = styled(StyledText)`
  line-height: ${props => fontSize(34, props.viewport)};
  letter-spacing: 0.06;
  text-align: center;
`
const DescText = styled(StyledText)`
  text-align: center;
  padding-horizontal: ${props => getWidth(25, props.viewport)};
  padding-vertical: ${props => getWidth(50, props.viewport)};
`
const BottomContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  flex: 0.25;
  padding-horizontal: ${props => getWidth(25, props.viewport)};
`
const SignInButton = styled.TouchableOpacity`
  padding-horizontal: ${props => getWidth(25, props.viewport)};
  padding-vertical: ${props => getWidth(25, props.viewport)};
  position: absolute;
  right: 0;
  top: 0;
`

class InitScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: ''
    }
  }

  onSignComplete = () => {
    this.setState({ loading: '' })
  }

  toSignUp = () => {
    trackEvent('get_started_pressed', category.ONBOARD, 'Presses Get Started button')
    navigationService.navigate(screens.SIGN_UP)
  }

  toSignIn = () => {
    trackEvent('sign_in_pressed', category.ONBOARD, 'Presses Sign in link')
    navigationService.navigate(screens.SIGN_IN)
  }

  renderGetStartedButton = () => {
    return (
      <PrimaryButton
        onPress={this.toSignUp}
        title={'Get started'}
      />
    )
  }

  renderSignInButton = () => {
    const { viewport } = this.props
    return (
      <SignInButton
        viewport={viewport}
        onPress={this.toSignIn}
      >
        <StyledText fontSize={18} color={WHITE}>
          Sign in
        </StyledText>
      </SignInButton>
    )
  }

  renderPromo = () => {
    const { viewport } = this.props
    const size = 24
    return (
      <PromotionText viewport={viewport} fontSize={size} color={WHITE}>
        {'Payday, Any Day\n'}
        {'It\'s '}
        <Logo size={size} dot />
      </PromotionText>
    )
  }

  renderDesc = () => {
    const { viewport } = this.props
    const text = 'Powerful tools that help you save time, win more jobs, and earn more money.'
    return (
      <DescText viewport={viewport} fontSize={18} color={WHITE}>
        {text}
      </DescText>
    )
  }

  render () {
    const { viewport } = this.props
    return (
      <Page backgroundColor={AQUA_MARINE}>
        <Content>
          {this.renderSignInButton()}
          <LogoContainer>
            <Logo viewport={viewport} />
            {
              // this.renderPromo()
            }
          </LogoContainer>
          <BottomContainer viewport={viewport}>
            {this.renderDesc()}
            {this.renderGetStartedButton()}
          </BottomContainer>
        </Content>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(InitScreen)
