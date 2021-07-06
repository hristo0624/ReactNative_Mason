import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TopBar } from '@shopify/polaris'
import styled from 'styled-components'
import _ from 'lodash'

import { WHITE } from 'constants/colors'
import { signOut } from 'controllers/auth'
import { switchAccount } from 'controllers/user'
import history from 'src/history'

const Container = styled.div`
  .Polaris-TopBar__SearchField {
    margin-left: 0;
    padding: 0 0 !important;
  }
`
const StyledText = styled.span`
  color: ${WHITE};
`

class CustomTopBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userMenuOpen: false
    }
  }

  toggleUserMenu = () => this.setState({ userMenuOpen: !this.state.userMenuOpen })

  onSettingsClick = () => {
    history.push('/settings')
  }

  onLogoutClick = () => {
    const { dispatch } = this.props
    console.log('onLogoutClick')
    dispatch(signOut())
  }

  firstLetter = (str) => {
    try {
      return str.charAt(0).toUpperCase()
    } catch (e) {
      return ''
    }
  }

  renderText = (str) => {
    return (
      <StyledText>{str}</StyledText>
    )
  }

  onSwitchAccount = id => async () => {
    await switchAccount(id)
  }

  renderUserMenu = () => {
    const { userMenuOpen } = this.state
    const { user, account } = this.props
    if (user) {
      const accounts = _.map(_.get(user, 'accounts'), (v) => (
        {
          content: v.companyName,
          onAction: this.onSwitchAccount(v.id)
        }
      ))
      const accountsActions = accounts.length > 1 ? [ { items: accounts } ] : []
      const userMenuActions = [
        ...accountsActions,
        {
          items: [
            { content: 'My Profile' },
            { content: 'Settings', onAction: this.onSettingsClick },
            { content: 'Help' },
            { content: 'Logout', onAction: this.onLogoutClick }
          ]
        }
      ]
      const email = _.get(user, 'profile.email', '...')
      const name = _.get(user, 'profile.name', email)
      let initials = '...'
      // console.log('renderUserMenu', name)
      if (name) {
        const initialsAr = name.split(' ')
        initials = `${this.firstLetter(_.get(initialsAr, [0], ''))}${this.firstLetter(_.get(initialsAr, [1], ''))}`
      }
      const companyName = _.get(account, 'company.name')
      return (
        <TopBar.UserMenu
          actions={userMenuActions}
          name={this.renderText(name)}
          detail={companyName}
          initials={initials}
          open={userMenuOpen}
          onToggle={this.toggleUserMenu}
        />
      )
    }
  }

  render () {
    const { toggleMobileNavigation } = this.props
    return (
      <Container>
        <TopBar
          showNavigationToggle
          userMenu={this.renderUserMenu()}
          onNavigationToggle={toggleMobileNavigation}
        />
      </Container>
    )
  }
}

CustomTopBar.propTypes = {
  toggleMobileNavigation: PropTypes.func
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account
})

export default connect(mapStateToProps)(CustomTopBar)
