import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Platform } from 'react-native'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as Permissions from 'expo-permissions'
import emailValidator from 'email-validator'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import PicWithChevron from 'shared/components/sections/PicWithChevron'
import { PALE_GREY, WHITE, AQUA_MARINE, LIGHT_GREY_BLUE } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'
import { saveProfile } from 'controllers/data'
import navigationService from 'shared/navigation/service'
import { getRolesTitles } from 'model/selectors/rolesSelectors'
import { initialsByName } from 'shared/utils/stringUtils'

class MyProfile extends Component {
  constructor (props) {
    super(props)
    const { user, account } = this.props
    const currentAccountId = _.get(user, 'currentAccountId')
    const role = _.get(account, ['admins', currentAccountId, 'role'])
    this.state = {
      name: _.get(user, 'profile.name', null),
      phone: _.get(user, 'profile.contactPhone', null),
      email: _.get(user, 'profile.contactEmail', _.get(user, 'profile.email', null)),
      avatar: _.get(user, 'profile.avatar', null),
      avatarSmall: _.get(user, 'profile.avatarSmall', null),
      role: _.get(props, ['rolesDict', role]),
      errors: {}
    }
  }

  resetError = (name) => () => {
    const { errors } = this.state
    const errorsCopy = { ...errors }
    delete errorsCopy[name]
    this.setState({ errors: errorsCopy })
  }

  handleChange = fieldName => value => {
    this.setState({
      [fieldName]: value,
      errors: {}
    })
  }

  renderNameInput = () => {
    const { name } = this.state
    return (
      <SectionItemInput
        value={name}
        placeholder={'Name'}
        onChange={this.handleChange('name')}
        onFocus={this.resetError('name')}
      />
    )
  }

  renderEmailInput = () => {
    const { email } = this.state
    return (
      <SectionItemInput
        value={email}
        numeric='email-address'
        placeholder={'email'}
        onChange={this.handleChange('email')}
        onFocus={this.resetError('email')}
      />
    )
  }

  renderPhoneInput = () => {
    const { phone } = this.state
    return (
      <SectionItemInput
        value={phone}
        keyboardType='numeric'
        placeholder={'Phone number'}
        maxLength={10}
        onChange={this.handleChange('phone')}
        onFocus={this.resetError('phone')}
      />
    )
  }

  openPic = async () => {
    let hasPermission = Platform.OS !== 'ios'
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        hasPermission = status === 'granted'
      } else {
        hasPermission = true
      }
    }
    if (hasPermission) {
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.6,
        base64: true
      }
      const res = await ImagePicker.launchImageLibraryAsync(options)
      const cancelled = _.get(res, 'cancelled')
      if (cancelled === false) {
        const avatar = _.get(res, 'uri', null)
        const actions = [{
          resize: {
            width: 50,
            height: 50
          }
        }]
        const outputOptions = {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG
        }
        const manipResult = await ImageManipulator.manipulateAsync(avatar, actions, outputOptions)
        this.setState({
          avatar,
          avatarSmall: manipResult.uri
        })
      }
    }
  }

  sections = () => {
    const { errors, avatarSmall, name } = this.state
    return [
      {
        title: 'My info',
        data: [
          {
            title: 'Name',
            key: 'name',
            actionField: this.renderNameInput(),
            error: _.get(errors, 'name')
          },
          {
            title: 'Contract phone number',
            key: 'phone',
            actionField: this.renderPhoneInput(),
            error: _.get(errors, 'phone')
          },
          {
            title: 'Contract email',
            key: 'email',
            actionField: this.renderEmailInput(),
            error: _.get(errors, 'email')
          },
          {
            title: 'Edit profile pic',
            key: 'pic',
            actionField: <PicWithChevron url={avatarSmall} initials={initialsByName(name)} />,
            onPress: this.openPic
          },
          {
            title: 'Role',
            key: 'role',
            actionField: <StyledText color={LIGHT_GREY_BLUE} fontSize={14}>{this.state.role.toUpperCase()}</StyledText>
          }
        ]
      }
    ]
  }

  save = () => {
    const { name, email, phone, avatar, avatarSmall } = this.state
    const { dispatch } = this.props

    const errors = {}
    if (name === '') errors.name = 'Enter your name'

    if (!_.isNil(email)) {
      const emailIsValid = emailValidator.validate(email)
      if (!emailIsValid) errors.email = 'This is not a valid email'
    }

    let phoneInfo
    if (!_.isNil(phone) && phone !== '') {
      phoneInfo = parsePhoneNumberFromString(phone)
      console.log('phone', phone, 'phone info', phoneInfo)
      if (_.isNil(phoneInfo) || !phoneInfo.isValid()) errors.phone = 'The phone number is not valid'
    }

    console.log('errors', errors)
    if (_.isEmpty(errors)) {
      const profile = {
        name: name,
        contactEmail: email,
        contactPhone: phoneInfo ? phoneInfo.number : null,
        avatar,
        avatarSmall
      }
      dispatch(saveProfile(profile))
      navigationService.goBack()
    } else {
      this.setState({ errors: errors })
    }
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: 'My Profile' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account,
  rolesDict: getRolesTitles(state)
})

export default connect(mapStateToProps)(MyProfile)
