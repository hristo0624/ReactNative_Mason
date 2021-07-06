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

  sections = () => {
    const { user } = this.props
    return [
      {
        title: 'SETTINGS',
        data: [
          {
            title: 'Reports',
            key: 0,
            disabled: true
          },
          {
            title: 'Agreements (with Mason)',
            key: 1,
            disabled: true
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
            title: 'Contact Mason',
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
