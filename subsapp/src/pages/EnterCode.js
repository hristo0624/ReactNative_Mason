import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import { View, TouchableOpacity, TextInput } from 'react-native'

import AuthPage, {
  Title,
  StyledDismissKeyboardView
} from 'shared/pages/AuthPage'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, fontSize, getWidth } from 'shared/utils/dynamicSize'

import { WHITE } from 'shared/constants/colors'
import { smsCodeLen } from 'constants/index'
import { checkVerificationCode } from 'controllers/auth'

const Wrapper = styled(View)`
  flex-direction: column;
`
const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`
const Button = styled(TouchableOpacity)`
  align-self: center;
  height: ${props => getHeight(25, props.viewport)};
`
const StyledIcon = styled(Icon)`
  margin-left: ${props => getWidth(16, props.viewport)};
`
const InputWrapper = styled(View)`
  flex-direction: column;
  align-items: center;
  margin-vertical: ${props => getHeight(36, props.viewport)};
  ${props => props.customStyle || ''}
`
const ContentWrapper = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`
const CellsWrapper = styled(View)`
  justify-content: flex-start;
  width: ${props => fontSize(210, props.viewport)};
`
const StyledTextInput = styled(TextInput)`
  width: 100%;
  font-family: Lato-Bold;
  font-size: ${props => fontSize(48, props.viewport)};
  text-align: left;
  color: white;
  /* background-color: yellow; */
  letter-spacing: ${props => fontSize(24, props.viewport)};
  margin-left: ${props => fontSize(8, props.viewport)};
`
const UnderLinesContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`
const UnderLine = styled(View)`
  flex: 1;
  border-bottom-width: 1;
  border-color: white;
  margin-right: ${props => fontSize(12, props.viewport)};
`

@withMappedNavigationParams()
class EnterCode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: '',
      codeError: null,
      isLoading: false
    }
  }

  componentWillUnmount () {
    this.onVerificationRes = () => null
  }

  onVerificationRes = (res) => {
    const er = _.get(res, 'error')
    if (er) {
      this.setState({
        codeError: er,
        isLoading: false
      })
    }
  }

  onSubmit = async () => {
    this.setState({ isLoading: true })
    const { code } = this.state
    const { phone } = this.props
    const res = await checkVerificationCode(phone, code)
    this.onVerificationRes(res)
  }

  handleSuccess = () => {
    this.setState({ isLoading: false })
  }

  handleError = error => {
    this.setState({
      isLoading: false,
      codeError: error
   })
  }

  onChange = code => this.setState({ code })

  editPhone = () => {
    this.props.navigation.goBack()
  }

  resendCode = () => {}

  onChangeText = (v) => {
    this.setState({
      code: v,
      codeError: ''
    })
  }


  renderInput () {
    const { viewport } = this.props
    const { code, codeError } = this.state
    return (
      <InputWrapper viewport={viewport}>
        <ContentWrapper>
          <StyledText fontSize={11} color='white'>
            {'VALIDATION CODE'}
          </StyledText>
          <CellsWrapper
            viewport={viewport}
          >
            <StyledTextInput
              value={code}
              onChangeText={this.onChangeText}
              maxLength={smsCodeLen}
              viewport={viewport}
              underlineColorAndroid='transparent'
              keyboardType='number-pad'
              returnKeyType='done'
            />
            <UnderLinesContainer viewport={viewport}>
              {[...Array(smsCodeLen).keys()].map((v, i) => (
                <UnderLine key={i} viewport={viewport} />
              ))}
            </UnderLinesContainer>
          </CellsWrapper>
          <StyledText color='yellow' viewport={viewport} fontSize={14}>{codeError}</StyledText>
        </ContentWrapper>
      </InputWrapper>
    )
  }

  render () {
    const { viewport, navigation, phone } = this.props
    const { code, codeError, isLoading } = this.state
    console.log('code', code, 'code length', code.length, 'smsCodeLen', smsCodeLen)
    return (
      <AuthPage onBack={navigation.goBack}>
        <StyledDismissKeyboardView viewport={viewport}>
          <Wrapper>
            <Wrapper>
              <Title fontSize={20} textAlign='center'>
                Enter validation code
              </Title>
              <StyledText
                fontSize={16}
                color={WHITE}
                textAlign='center'
                customStyle={`margin-vertical: ${getHeight(16, viewport)}`}
              >
                Validation code was sent to your number
              </StyledText>
              <Button
                viewport={viewport}
                activeOpacity={0.75}
                onPress={this.editPhone}
              >
                <Row>
                  <StyledText color={WHITE} fontSize={16}>
                    {phone}
                  </StyledText>
                  <StyledIcon
                    viewport={viewport}
                    name='pencil'
                    color={WHITE}
                    size={fontSize(16, viewport)}
                  />
                </Row>
              </Button>
            </Wrapper>

            {this.renderInput()}

            <PrimaryButton
              onPress={this.onSubmit}
              title={'Next'}
              customStyle={`margin-vertical: ${getHeight(25, viewport)}`}
              disabled={code.length < smsCodeLen}
              loading={isLoading}
            />
            <Button
              viewport={viewport}
              activeOpacity={0.75}
              onPress={this.resendCode}
            >
              <StyledText
                color={WHITE}
                fontSize={12}
                customStyle={
                  `text-decoration: underline;
                  text-decoration-color: white;`
                }>
                {'Haven’t received a code? Resend'}
              </StyledText>
            </Button>
          </Wrapper>
        </StyledDismissKeyboardView>
      </AuthPage>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(EnterCode)
