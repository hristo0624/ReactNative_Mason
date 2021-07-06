import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import HeaderBackButton from 'shared/components/navbar/BackButton'
import { StyledText } from 'shared/components/StyledComponents'
import DismissKeyboardView from 'shared/components/DismissKeyboardView'
import { getWidth, getHeight } from 'shared/utils/dynamicSize'

import { WHITE, AQUA_MARINE } from 'shared/constants/colors'
import { isIos } from 'constants/index'

const NavBarWrapper = styled.View`
  padding-horizontal: ${props => getWidth(14, props.viewport)};
`

export const StyledDismissKeyboardView = styled(DismissKeyboardView)`
  width: 100%;
  height: 90%;
  justify-content: space-between;
  align-self: center;
  padding-horizontal: ${props => getWidth(28, props.viewport)};
  padding-top: ${props => getWidth(40, props.viewport)};
`
export const InputWrapper = styled.View`
  padding-top: ${({ viewport }) => getHeight(50, viewport)};
  flex: 3;
`
export const Title = ({ children, ...props }) => (
  <StyledText color={WHITE} fontSize={20} {...props}>
    {children}
  </StyledText>
)

export const EMAIL_ERROR_MESSAGE = 'Please enter a valid email address'
export const PASSWORD_ERROR_MESSAGE = 'Password should be at least 6 characters'

const behavior = isIos ? 'padding' : undefined

class AuthPage extends Component {
  componentWillUnmount () {
    this.handleSuccess = () => null
    this.handleError = () => null
  }

  renderContent = () => {
    const { children, withAvoiding } = this.props
    if (withAvoiding) {
      return (
        <KeyboardAvoidingView
          enabled
          behavior={behavior}
        >
          {children}
        </KeyboardAvoidingView>
      )
    } else {
      return children
    }
  }

  render () {
    const { viewport, onBack } = this.props
    const leftButton = onBack ? <HeaderBackButton color={WHITE} onPress={onBack} /> : null
    return (
      <Page backgroundColor={AQUA_MARINE}>
        <NavBarWrapper viewport={viewport}>
          <NavBar
            leftButton={leftButton}
            transparent
          />
        </NavBarWrapper>
        {this.renderContent()}
      </Page>
    )
  }
}

AuthPage.defaultProps = {
  withAvoiding: true
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

AuthPage.propTypes = {
  withAvoiding: PropTypes.bool,
  onBack: PropTypes.func
}

export default connect(mapStateToProps)(AuthPage)
