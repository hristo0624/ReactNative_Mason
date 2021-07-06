import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import { getRolesTitles } from 'model/selectors/rolesSelectors'
import screens from 'constants/screens'

class Roles extends Component {
  editRole = (roleId) => () => navigationService.push(screens.EDIT_ROLE, { roleId })
  createNewRole = () => navigationService.push(screens.CREATE_ROLE)

  sections = () => {
    const { rolesTitles } = this.props
    const items = _.map(rolesTitles, (title, roleId) => {
      return {
        title: title,
        key: roleId,
        onPress: this.editRole(roleId)
      }
    })
    return [
      {
        title: 'CURRENT ROLES',
        data: [
          ...items,
          {
            title: 'Create new role',
            key: 'new',
            onPress: this.createNewRole,
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
          title={{ title: 'Roles' }}
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
  rolesTitles: getRolesTitles(state)
})

export default connect(mapStateToProps)(Roles)
