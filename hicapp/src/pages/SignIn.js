import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import validator from 'email-validator'

import AuthPage, {
  Title,
  InputWrapper,
  StyledDismissKeyboardView,
  EMAIL_ERROR_MESSAGE,
  PASSWORD_ERROR_MESSAGE
} from 'shared/pages/AuthPage'
import Input from 'shared/components/inputs/Input'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { StyledText } from 'shared/components/StyledComponents'
import { signInWithEmailAndPassword } from 'controllers/auth'
import { getHeight } from 'shared/utils/dynamicSize'
import { WHITE } from 'shared/constants/colors'
import screens from 'constants/screens'
import navigationService from 'shared/navigation/service'
import { trackEvent, category } from 'utils/analytics'

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isLoading: false
    }
  }

  onEmailInputMounted = r => {
    this.emailInput = r
  }

  onPasswordInputMounted = r => {
    this.passwordInput = r
  }

  onFinishEditingEmail = () => {
    const { email } = this.state
    if (!validator.validate(email)) {
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }
    trackEvent('sign_in_email_entered_valid', category.ONBOARD, 'user enters valid email address on Sign In page', email)
    this.passwordInput.focus()
    return this.setState({ emailError: '' })
  }

  onFinishEditingPassword = () => {
    if (this.state.password.length < 6) {
      return this.setState({ passwordError: PASSWORD_ERROR_MESSAGE })
    }
    return this.setState({ passwordError: '' })
  }

  onSubmit = () => {
    const { email, password } = this.state
    const { dispatch } = this.props
    trackEvent('sign_in_pressed', category.ONBOARD, 'user presses Sign In button')
    if (password.length < 6) {
      trackEvent('sign_in_pressed_error', category.ONBOARD, 'user presses Sign In button and is shown an error', PASSWORD_ERROR_MESSAGE)
      return this.setState({ passwordError: PASSWORD_ERROR_MESSAGE })
    }

    if (!validator.validate(email)) {
      trackEvent('sign_in_pressed_error', category.ONBOARD, 'user presses Sign In button and is shown an error', EMAIL_ERROR_MESSAGE)
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }

    this.setState({ isLoading: true })
    dispatch(
      signInWithEmailAndPassword(email, password, this.handleError, this.handleSuccess)
    )
  }

  handleSuccess = () => {
    this.setState({ isLoading: false })
  }

  handleError = error => {
    console.log('handle error', error)
    trackEvent('sign_in_pressed_error', category.ONBOARD, 'user presses Sign In button and is shown an error', error.message, error.code)
    switch (error.code) {
      case 'auth/invalid-email':
        this.setState({
          emailError: 'The specified email is not a valid email'
        })
        this.emailInput.focus()
        break
      case 'auth/wrong-password':
        this.setState({
          passwordError: 'The specified user account password is incorrect'
        })
        this.passwordInput.focus()
        break
      case 'auth/user-not-found':
        this.setState({
          emailError: 'The specified user account does not exist'
        })
        this.emailInput.focus()
        break
      case 'auth/user-disabled':
        this.setState({ emailError: 'The specified user account is disabled' })
        this.emailInput.focus()
        break
      case 'auth/network-request-failed':
        this.setState({ emailError: 'A network error has occurred' })
        break
    }
    this.setState({ isLoading: false })
  }

  onEmailChange = email => {
    // trackEvent('sign_in_email_entered', category.ONBOARD, 'user enters text in email textinput on Sign In page', email)
    this.setState({ email })
  }

  onPasswordChange = password => this.setState({ password })

  onForgotPassword = () => {
    trackEvent('forgot_password_click', category.ONBOARD, 'user presses Forgot password button')
    navigationService.push(screens.FORGOT_PASSWORD)
  }

  render () {
    const { viewport } = this.props
    const { emailError, passwordError, isLoading } = this.state
    return (
      <AuthPage onBack={() => null}>
        <StyledDismissKeyboardView viewport={viewport}>
          <Title>Sign in</Title>
          <InputWrapper viewport={viewport}>
            <Input
              autoFocus
              label='email'
              onChangeText={this.onEmailChange}
              getRef={this.onEmailInputMounted}
              error={emailError}
              onBlur={this.onFinishEditingEmail}
              onSubmitEditing={this.onFinishEditingEmail}
              keyboardType='email-address'
            />
            <Input
              label='password'
              onChangeText={this.onPasswordChange}
              getRef={this.onPasswordInputMounted}
              error={passwordError}
              secureTextEntry
              onBlur={this.onFinishEditingPassword}
              onSubmitEditing={this.onFinishEditingPassword}
            />
            <TouchableOpacity activeOpacity={0.75} onPress={this.onForgotPassword}>
              <StyledText color={WHITE} fontSize={14}>{'Forgot your password?'}</StyledText>
            </TouchableOpacity>
            <PrimaryButton
              onPress={this.onSubmit}
              title={'Sign in'}
              customStyle={`margin-vertical: ${getHeight(35, viewport)}`}
              loading={isLoading} />
          </InputWrapper>
        </StyledDismissKeyboardView>
      </AuthPage>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SignIn)
