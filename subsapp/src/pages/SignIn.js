import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import AuthPage, {
  Title,
  StyledDismissKeyboardView
} from 'shared/pages/AuthPage'
import Input from 'shared/components/inputs/Input'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { StyledText } from 'shared/components/StyledComponents'
import { getHeight } from 'shared/utils/dynamicSize'
import screens from 'constants/screens'
import { WHITE } from 'shared/constants/colors'
import { requestSmsCode } from 'controllers/auth'

const Wrapper = styled.View`
  flex-direction: column;
`

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      phone: '',
      phoneError: '',
      isValid: false,
      isLoading: false
    }
  }

  validatePhone (phone) {
    console.log('validate phone', phone)
    const phoneNumber = parsePhoneNumberFromString(phone, 'US')
    if (phoneNumber) {
      return phoneNumber.isValid()
    } else {
      return false
    }
  }

  onFinishEditingPhone = () => {
    const phoneError =
      this.validatePhone(this.state.phone)
        ? null
        : 'Invalid phone number'
    this.setState({
      phoneError,
      isValid: !phoneError
    })
  }

  onSubmit = () => {
    const { navigation, dispatch } = this.props
    const { phone } = this.state
    const phoneNumber = parsePhoneNumberFromString(phone, 'US')
    dispatch(requestSmsCode(phoneNumber.number))
    navigation.navigate(screens.ENTER_CODE, { phone: phoneNumber.number })
  }

  onPhoneChange = phone => {
    this.setState({
      phone,
      phoneError: null,
      isValid: this.validatePhone(phone)
    })
  }

  render () {
    const { viewport } = this.props
    const { phoneError, isValid } = this.state
    return (
      <AuthPage>
        <StyledDismissKeyboardView viewport={viewport}>
          <Wrapper>
            <Wrapper>
              <Title fontSize={20} textAlign='center'>
                Enter your phone number
              </Title>
              <StyledText
                fontSize={16}
                color={WHITE}
                textAlign='center'
                customStyle={`margin-vertical: ${getHeight(16, viewport)}`}
              >
                We will use this phone as your trusted device for authentication
              </StyledText>
            </Wrapper>
            <Input
              autoFocus
              label={'Phone'}
              onChangeText={this.onPhoneChange}
              error={phoneError}
              keyboardType={'phone-pad'}
              onBlur={this.onFinishEditingPhone}
              onSubmitEditing={this.onFinishEditingPhone}
              customStyle={`margin-vertical: ${getHeight(40, viewport)}`}
            />
          </Wrapper>
          <PrimaryButton
            onPress={this.onSubmit}
            disabled={!isValid}
            title={'Next'}
            customStyle={`margin-vertical: ${getHeight(35, viewport)}`}
          />
        </StyledDismissKeyboardView>
      </AuthPage>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SignIn)
