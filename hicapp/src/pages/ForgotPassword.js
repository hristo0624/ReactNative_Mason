import React, { Component } from 'react'
import { connect } from 'react-redux'
import validator from 'email-validator'

import AuthPage, {
  Title,
  StyledDismissKeyboardView,
  EMAIL_ERROR_MESSAGE
} from 'shared/pages/AuthPage'
import Input from 'shared/components/inputs/Input'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { sendPasswordResetEmail } from 'controllers/auth'
import { getHeight } from 'shared/utils/dynamicSize'
import screens from 'constants/screens'
import { trackEvent, category } from 'utils/analytics'

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailError: '',
      isLoading: false
    }
  }

  onEmailInputMounted = r => {
    this.emailInput = r
  }

  onFinishEditingEmail = () => {
    if (!validator.validate(this.state.email)) {
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }
    return this.setState({ emailError: '' })
  }

  onSubmit = () => {
    const { email } = this.state
    const { dispatch } = this.props
    trackEvent('forgot_password_reset', category.ONBOARD, 'presses reset button on Forgot Password page', email)
    if (!validator.validate(email)) {
      trackEvent('forgot_password_reset_error', category.ONBOARD, 'user presses Reset button on Forgot passwrod page and is shown an error', EMAIL_ERROR_MESSAGE)
      return this.setState({ emailError: EMAIL_ERROR_MESSAGE })
    }
    this.setState({ isLoading: true })
    dispatch(
      sendPasswordResetEmail(email, this.handleSuccess, this.handleError)
    )
  }

  handleSuccess = () => {
    const { navigation } = this.props
    this.setState({ isLoading: false })
    navigation.navigate(screens.SIGN_IN)
  }

  handleError = error => {
    trackEvent('forgot_password_reset_error', category.ONBOARD, 'user presses Reset button on Forgot passwrod page and is shown an error', error.message, error.code)
    switch (error.code) {
      case 'auth/user-not-found':
        this.setState({
          emailError: 'There is no user corresponding to the email address'
        })
        this.emailInput.focus()
        break
      case 'auth/invalid-email':
        this.setState({
          emailError: 'The specified email is not a valid email'
        })
        this.emailInput.focus()
        break
      case 'auth/user-disabled':
        this.setState({ emailError: 'The specified user account is disabled' })
        this.emailInput.focus()
        break
      default:
        this.setState({ emailError: 'A network error has occurred' })
        break
    }
    this.setState({ isLoading: false })
  }

  onEmailChange = email => this.setState({ email })

  render () {
    const { viewport } = this.props
    const { emailError, isLoading } = this.state
    return (
      <AuthPage>
        <StyledDismissKeyboardView viewport={viewport}>
          <Title>Forgot your password?</Title>
          <Input
            autoFocus
            label={'Email'}
            onChangeText={this.onEmailChange}
            getRef={this.onEmailInputMounted}
            error={emailError}
            onBlur={this.onFinishEditingEmail}
            onSubmitEditing={this.onFinishEditingEmail}
          />
          <PrimaryButton
            onPress={this.onSubmit}
            title={'Reset'}
            customStyle={`margin-vertical: ${getHeight(35, viewport)}`}
            loading={isLoading} />
        </StyledDismissKeyboardView>
      </AuthPage>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ForgotPassword)
