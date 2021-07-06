import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import { saveRole } from 'controllers/data'
import navigationService from 'shared/navigation/service'
import SectionItemSwitch from 'shared/components/sections/SectionItemSwitch'

class CreateRole extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      permissions: {},
      nameError: false
    }
  }

  togglePermission = (permId) => () => {
    console.log('togglePermission', permId)
    const { permissions } = this.state
    const curValue = _.get(permissions, permId, false)
    this.setState({
      permissions: {
        ...permissions,
        [permId]: !curValue
      }
    })
  }

  handleChangeName = (v) => this.setState({ name: v, nameError: false })

  save = () => {
    console.log('save')
    const { name, permissions } = this.state
    const { dispatch } = this.props
    if (name !== '') {
      const role = {
        title: name,
        permissions
      }
      dispatch(saveRole(role))
      navigationService.goBack()
    } else {
      this.setState({
        nameError: true
      })
    }
  }

  sections = () => {
    const { name, permissions, nameError } = this.state
    console.log('permissions', permissions)
    const { permsInfo } = this.props
    const sortedPermissions = _.sortBy(permsInfo, 'order')
    const items = _.map(sortedPermissions, ({ title, id }) => {
      const checked = _.get(permissions, id, false)
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
        title: 'Name',
        data: [
          {
            title: 'Role name',
            key: 'name',
            error: nameError,
            actionField: (
              <SectionItemInput
                value={name}
                placeholder={'Manager'}
                onChange={this.handleChangeName}
              />
            )
          }
        ],
        isFirst: true
      },
      {
        title: 'PERMISSIONS',
        data: [
          ...items
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
          title={{ title: 'Create new role' }}
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

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  permsInfo: _.get(state, 'references.permissions', {})
})

export default connect(mapStateToProps)(CreateRole)
