import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import { getRolesTitles, getRolePermissions } from 'model/selectors/rolesSelectors'
import { editPermission } from 'controllers/data'
import SectionItemSwitch from 'shared/components/sections/SectionItemSwitch'

@withMappedNavigationParams()
class EditRole extends Component {
  togglePermission = (permId) => () => {
    console.log('togglePermission', permId)
    const { permissions, dispatch, roleId } = this.props
    const curValue = _.get(permissions, permId, false)
    dispatch(editPermission(roleId, permId, !curValue))
  }

  sections = () => {
    const { permissions, permsInfo } = this.props
    const sortedPermissions = _.sortBy(permsInfo, 'order')
    const items = _.map(sortedPermissions, ({ title, id }) => {
      const checked = _.get(permissions, id)
      return {
        title,
        key: id,
        actionField: (
          <SectionItemSwitch
            checked={checked}
            onChange={this.togglePermission(id)}
            trackColor={AQUA_MARINE}
          />
        )
      }
    })
    return [
      {
        title: 'PERMISSIONS',
        data: [
          ...items
        ],
        isFirst: true
      }
    ]
  }

  render () {
    const { roleId, rolesTitles } = this.props
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: _.get(rolesTitles, roleId) }}
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

const mapStateToProps = (state, props) => ({
  viewport: state.viewport,
  rolesTitles: getRolesTitles(state),
  permissions: getRolePermissions(state, props.navigation.state.params.roleId),
  permsInfo: _.get(state, 'references.permissions', {})
})

export default connect(mapStateToProps)(EditRole)
