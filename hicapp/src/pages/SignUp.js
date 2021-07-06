import React, { Component } from 'react'
import { connect } from 'react-redux'
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
import { signUpWithEmailAndPassword } from 'controllers/auth'
import { getHeight } from 'shared/utils/dynamicSize'
import { trackEvent, category } from 'utils/analytics'
import { setCompanyName } from 'controllers/init'

const COMPANY_NAME_ERROR_MESSAGE = 'Company name can not be blank'
const USER_NAME_ERROR_MESSAGE = 'Name can not be blank'

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      isLoading: false,
      companyName: '',
      userName: ''
    }
  }

  onEmailInputMounted = r => {
    this.emailInput = r
  }

  onPasswordInputMounted = r => {
    this.passwordInput = r
  }

  onCompanyNameInputMounted = r => {
    this.companyNameInput = r
  }

  onUserNameInputMounted = r => {
    this.userNameInput = r
  }

  onFinishEditingEmail = () => {
    const { email } = this.state
    if (!validator.validate(email)) {
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }
    trackEvent('sign_up_email_entered_valid', category.ONBOARD, 'user enters valid email address on Sign Up page', email)
    this.userNameInput.focus()
    return this.setState({ emailError: '' })
  }

  onFinishEditingPassword = () => {
    if (this.state.password.length < 6) {
      return this.setState({ passwordError: PASSWORD_ERROR_MESSAGE })
    }
    return this.setState({ passwordError: '' })
  }

  onFinishEditingCompanyName = () => {
    if (this.state.companyName === '') {
      return this.setState({ companyNameError: COMPANY_NAME_ERROR_MESSAGE })
    }
    this.passwordInput.focus()
    return this.setState({ companyNameError: '' })
  }

  onFinishEditingUserName = () => {
    if (this.state.userName === '') {
      return this.setState({ userNameError: USER_NAME_ERROR_MESSAGE })
    }
    this.companyNameInput.focus()
    return this.setState({ userNameError: '' })
  }

  onSubmit = async () => {
    const { email, password, companyName, userName } = this.state
    trackEvent('sign_up_pressed', category.ONBOARD, 'user presses Sign Up button')
    if (password.length < 6) {
      trackEvent('sign_up_pressed_error', category.ONBOARD, 'user presses Sign Up button and is shown an error', PASSWORD_ERROR_MESSAGE)
      return this.setState({ passwordError: PASSWORD_ERROR_MESSAGE })
    }

    if (!validator.validate(email)) {
      trackEvent('sign_up_pressed_error', category.ONBOARD, 'user presses Sign Up button and is shown an error', EMAIL_ERROR_MESSAGE)
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }

    if (companyName === '') {
      trackEvent('sign_up_pressed_error', category.ONBOARD, 'user presses Sign Up button and is shown an error', COMPANY_NAME_ERROR_MESSAGE)
      return this.setState({ companyNameError: COMPANY_NAME_ERROR_MESSAGE })
    }

    if (userName === '') {
      trackEvent('sign_up_pressed_error', category.ONBOARD, 'user presses Sign Up button and is shown an error', USER_NAME_ERROR_MESSAGE)
      return this.setState({ userNameError: USER_NAME_ERROR_MESSAGE })
    }

    trackEvent('sign_up_email_entered_valid', category.ONBOARD, 'user enters valid email address on Sign Up page', email)
    this.setState({ isLoading: true })
    setCompanyName(companyName)
    const er = await signUpWithEmailAndPassword(email, password, userName)
    if (er) {
      this.handleError(er)
    }
  }

  handleSuccess = () => {
    this.setState({ isLoading: false })
  }

  handleError = error => {
    trackEvent('sign_up_pressed_error', category.ONBOARD, 'user presses Sign Up button and is shown an error', error.message, error.code)
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.setState({ emailError: 'Email is already in use' })
        this.emailInput.focus()
        break
      case 'auth/invalid-email':
        this.setState({ emailError: 'The specified email is not a valid email' })
        this.emailInput.focus()
        break
      case 'auth/operation-not-allowed':
        this.setState({ emailError: 'Operation is not allowed' })
        this.emailInput.focus()
        break
      case 'auth/weak-password':
        this.setState({ passwordError: 'The specified password is not strong enough' })
        this.passwordInput.focus()
        break
      case 'auth/network-request-failed':
        this.setState({ passwordError: 'A network error has occurred' })
        break
    }
    this.setState({ isLoading: false })
  }

  onEmailChange = email => {
    // trackEvent('sign_up_email_entered', category.ONBOARD, 'user enters text in email textinput on Sign Up page', email)
    this.setState({ email })
  }

  onPasswordChange = password => this.setState({ password })
  onCompanyNameChange = companyName => this.setState({ companyName })
  onUserNameChange = userName => this.setState({ userName })

  render () {
    const { viewport } = this.props
    const { emailError, passwordError, companyNameError, userNameError, isLoading } = this.state
    return (
      <AuthPage onBack={() => null}>
        <StyledDismissKeyboardView viewport={viewport}>
          <Title>{'Sign up'}</Title>
          <InputWrapper viewport={viewport}>
            <Input
              autoFocus
              label={'email'}
              onChangeText={this.onEmailChange}
              getRef={this.onEmailInputMounted}
              error={emailError}
              onBlur={this.onFinishEditingEmail}
              onSubmitEditing={this.onFinishEditingEmail}
              keyboardType='email-address'
            />
            <Input
              label={'full name'}
              onChangeText={this.onUserNameChange}
              getRef={this.onUserNameInputMounted}
              error={userNameError}
              onBlur={this.onFinishEditingUserName}
              onSubmitEditing={this.onFinishEditingUserName}
            />
            <Input
              label={'company name'}
              onChangeText={this.onCompanyNameChange}
              getRef={this.onCompanyNameInputMounted}
              error={companyNameError}
              onBlur={this.onFinishEditingCompanyName}
              onSubmitEditing={this.onFinishEditingCompanyName}
            />
            <Input
              label={'password'}
              onChangeText={this.onPasswordChange}
              getRef={this.onPasswordInputMounted}
              error={passwordError}
              secureTextEntry
              onBlur={this.onFinishEditingPassword}
              onSubmitEditing={this.onFinishEditingPassword}
            />
            <PrimaryButton
              onPress={this.onSubmit}
              title={'Sign up'}
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

export default connect(mapStateToProps)(SignUp)
