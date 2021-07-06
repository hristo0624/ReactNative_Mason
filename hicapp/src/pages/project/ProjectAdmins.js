import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import SectionItemSwitch from 'shared/components/sections/SectionItemSwitch'
import { updateProjectAdmins } from 'controllers/project'

class ProjectAdmins extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectAdmins: _.get(props, 'project.admins', {})
    }
  }

  toggleAccess = (userId) => () => {
    const { projectAdmins } = this.state
    const curVal = _.get(projectAdmins, userId, false)
    this.setState({
      projectAdmins: {
        ...projectAdmins,
        [userId]: !curVal
      }
    })
  }

  save = () => {
    console.log('save')
    const { projectAdmins } = this.state
    const { user, account, dispatch } = this.props
    const res = {}
    const admins = _.get(account, 'admins', {})
    for (const adminId in admins) {
      const isProjectAdmin = _.get(projectAdmins, adminId, false) || (adminId === user.id)
      _.set(res, adminId, isProjectAdmin || null)
    }
    dispatch(updateProjectAdmins(res))
    navigationService.goBack()
  }

  sections = () => {
    const { projectAdmins } = this.state
    const { account, user, roles } = this.props
    const admins = _.get(account, 'admins', {})
    const adminsItems = _.map(admins, (adm, userId) => {
      const roleTitle = _.get(roles, [adm.role, 'title'])
      return {
        title: _.get(adm, 'name', _.get(adm, 'email', '')),
        desc: roleTitle,
        key: userId,
        disabled: userId === user.id,
        actionField: (
          <SectionItemSwitch
            checked={_.get(projectAdmins, userId, false)}
            onChange={this.toggleAccess(userId)}
            trackColor={AQUA_MARINE}
            disabled={userId === user.id}
          />
        )
      }
    })
    return [
      {
        data: [
          ...adminsItems
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
          title={{ title: 'People' }}
          leftButton={<BackButton />}
          rightButton={{ title: 'Save', tintColor: AQUA_MARINE, handler: this.save }}
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
  roles: _.get(state, 'references.roles'),
  project: state.project
})

export default connect(mapStateToProps)(ProjectAdmins)
