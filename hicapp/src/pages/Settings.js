import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Text } from 'react-native'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE } from 'shared/constants/colors'
import { signOut } from 'controllers/auth'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  renderContent = () => {
    return <Text>Settings content</Text>
  }

  signOut = async () => {
    await signOut()
  }

  toUsers = () => navigationService.push(screens.USERS)
  toRoles = () => navigationService.push(screens.ROLES)
  toProfile = () => navigationService.push(screens.PROFILES)
  toVerifyLicense = () => navigationService.push(screens.VERIFY_LICENSE)

  sections = () => {
    const { user } = this.props
    return [
      {
        title: 'SETTINGS',
        data: [
          {
            title: 'My info',
            key: 'my info',
            onPress: this.toProfile
          },
          {
            title: 'Roles',
            key: 0,
            onPress: this.toRoles
          },
          {
            title: 'Users',
            key: 1,
            onPress: this.toUsers
          },
          {
            title: 'Reports',
            key: 2,
            disabled: true
          },
          {
            title: 'Agreements (with Mason)',
            key: 3,
            disabled: true
          },
          {
            title: 'Verify license',
            key: 4,
            onPress: this.toVerifyLicense
          }
        ],
        isFirst: true
      },
      {
        title: 'PAYMENTS',
        data: [
          {
            title: 'Payout method',
            key: 0,
            disabled: true
          }
        ]
      },
      {
        title: 'HELP',
        data: [
          {
            title: 'Contact us',
            key: 0,
            disabled: true
          },
          {
            title: 'Sign out',
            key: 1,
            desc: _.get(user, 'profile.email'),
            onPress: this.signOut
          }
        ]
      }
    ]
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
          title={{ title: 'Settings' }}
          leftButton={<BackButton />}
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
  viewport: state.viewport,
  user: state.user,
  account: state.account
})

export default connect(mapStateToProps)(Settings)
