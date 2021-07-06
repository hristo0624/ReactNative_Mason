import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import PlusButton from 'shared/components/navbar/PlusButton'

class Users extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  openInvite = () => navigationService.push(screens.INVITE_USER)

  editUser = (userId) => () => {
    console.log('editUser', userId)
  }

  sections = () => {
    const { account, user, roles } = this.props
    const admins = _.get(account, 'admins', {})
    const adminsItems = _.map(admins, (adm, userId) => {
      const roleTitle = _.get(roles, [adm.role, 'title'])
      const desc = adm.pending ? `${roleTitle} (pending)` : roleTitle
      return {
        title: _.get(adm, 'name', _.get(adm, 'email', '')),
        desc: desc,
        key: userId,
        disabled: userId === user.id,
        onPress: this.editUser(userId)
      }
    })
    return [
      {
        title: 'CURRENT USERS',
        data: [
          ...adminsItems,
          {
            title: 'Invite',
            key: 'invite',
            onPress: this.openInvite,
            addNewField: true
          }
        ],
        isFirst: true
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
          title={{ title: 'Users' }}
          leftButton={<BackButton />}
          rightButton={<PlusButton color={AQUA_MARINE} onPress={this.openInvite} />}
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
  account: state.account,
  roles: _.get(state, 'references.roles')
})

export default connect(mapStateToProps)(Users)
