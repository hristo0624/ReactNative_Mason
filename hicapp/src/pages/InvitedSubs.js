import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View } from 'react-native'
import _ from 'lodash'
import styled from 'styled-components'
import * as Contacts from 'expo-contacts'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE, ICE_BLUE, DUSK } from 'shared/constants/colors'
import Search from 'shared/components/inputs/Search'
import { getWidth, getHeight, fontSize } from 'shared/utils/dynamicSize'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import CreateSubContact from 'components/panels/CreateSubContact'
import { StyledText } from 'shared/components/StyledComponents'
import navigationService from 'shared/navigation/service'
import SendInvitationPanel from 'components/panels/SendInvitationPanel'

const SearchFieldContainer = styled(View)`
  width: 100%;
  background-color: ${WHITE};
`

@withMappedNavigationParams()
class InvitedSubs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      createSubPanelVisible: false,
      invitationPanelVisible: false,
      contacts: [],
      invitedSubs: _.get(props, 'invitedSubs', {})
    }
  }

  componentWillMount = async () => {
    const contactsRes = await Contacts.getContactsAsync()
    const dataRaw = _.get(contactsRes, 'data', [])
    const data = []
    console.log('contacts dataRaw', dataRaw)
    for (const c of dataRaw) {
      const hasFirstName = _.has(c, 'firstName')
      const hasLastName = _.has(c, 'lastName')
      const hasPhone = _.has(c, ['phoneNumbers', 0, 'digits'])
      if (hasFirstName && hasLastName && hasPhone) {
        const countryCode = _.get(c, ['phoneNumbers', 0, 'countryCode'])
        const phoneRaw = _.get(c, ['phoneNumbers', 0, 'digits'])
        const phoneWithoutCode = phoneRaw.substring(phoneRaw.length - 10)
        const phoneNumber = countryCode === 'ru' ? `+7${phoneWithoutCode}` : `+1${phoneWithoutCode}`
        const contact = {
          id: c.id,
          email: _.get(c, ['emails', 0, 'email'], null),
          firstName: _.get(c, 'firstName', null),
          lastName: _.get(c, 'lastName', null),
          phone: phoneNumber,
          company: _.get(c, 'company', null)
        }
        const aInfo = _.get(c, ['addresses', 0])
        if (aInfo) {
          const city = _.get(aInfo, 'city', '')
          const street = _.get(aInfo, 'street', '')
          const stateAbbr = _.get(aInfo, 'region', '')
          const zipcode = _.get(aInfo, 'postalCode', '')
          const country = _.get(aInfo, 'country', '')
          const address = {
            city,
            description: `${street}, ${city}, ${stateAbbr} ${zipcode}, ${country}`,
            name: street,
            stateAbbr,
            zipcode,
            structured: {
              main: street,
              secondary: `${city}, ${stateAbbr}, ${country}`
            }
          }
          contact.address = address
        }
        data.push(_.omitBy(contact, _.isNil))
      } else {
        // console.log('skip contact', c, 'hasFirstName', hasFirstName, 'hasLastName', hasLastName, 'hasPhone', hasPhone)
      }
    }
    const sortedData = _.sortBy(data, c => _.lowerCase(`${c.firstName} ${c.lastName}`))
    this.contactsRaw = sortedData
    this.setState({
      contacts: sortedData
    })
  }

  onChangeSearch = (v) => this.setState({ searchString: v })

  renderSearchField = () => {
    const { viewport } = this.props
    const { searchString } = this.state
    return (
      <SearchFieldContainer>
        <Search
          value={searchString}
          onChangeText={this.onChangeSearch}
          placeholder={'Search subs and contacts'}
          type='dark'
          inputCustomStyle={`
            background-color: ${ICE_BLUE};
            height: ${fontSize(32, viewport)};
            border-width: 0;

          `}
          customStyle={`
            background-color: ${ICE_BLUE};
            margin-horizontal: ${getWidth(10, viewport)};
            margin-vertical: ${getHeight(10, viewport)};
            border-width: 1;
            border-color: ${PALE_GREY};
            border-radius: ${fontSize(5, viewport)};
          `}
        />
      </SearchFieldContainer>
    )
  }

  toggleCreateSubPanel = () => this.setState({ createSubPanelVisible: !this.state.createSubPanelVisible })
  toggleInvitationPanel = () => this.setState({ invitationPanelVisible: !this.state.invitationPanelVisible })

  renderNewContactButton = () => {
    const { viewport } = this.props
    return (
      <PrimaryButton
        customStyle={`
          height: ${getHeight(44, viewport)};
          width: ${getWidth(240, viewport)};
          margin-top: ${getHeight(10, viewport)};
          align-self: center;
        `}
        title='Create new contact'
        onPress={this.toggleCreateSubPanel}
      />
    )
  }

  renderCreateSubPanel = () => {
    const { createSubPanelVisible } = this.state
    return (
      <CreateSubContact
        visible={createSubPanelVisible}
        onClose={this.toggleCreateSubPanel}
      />
    )
  }

  renderMySubsSection = () => {
    return []
  }

  invite = c => this.setState({
    invitedSubs: {
      ...this.state.invitedSubs,
      [c.id]: c
    }
  })

  tryToInvite = c => () => {
    this.setState({
      invitationPanelVisible: true,
      inviteContact: c
    })
  }

  contactsList = () => {
    const { contacts, searchString, invitedSubs } = this.state
    const { viewport } = this.props
    const res = []
    for (const c of contacts) {
      let needed = false
      if (searchString === '') {
        needed = true
      } else {
        const reg = new RegExp(searchString, 'gi')
        needed = c.name.match(reg)
      }
      if (needed) {
        const invited = _.has(invitedSubs, c.id)
        const desc = _.get(c, 'spec', _.get(c, 'company', _.get(c, 'phone')))
        res.push({
          title: `${_.get(c, 'firstName', '')} ${_.get(c, 'lastName', '')}`,
          key: c.id,
          desc: desc,
          actionField: (
            <PrimaryButton
              color={AQUA_MARINE}
              title={invited ? 'Invited' : 'Invite'}
              customStyle={`
                width: ${getWidth(120, viewport)};
                height: ${getHeight(30, viewport)};
                border-radius: ${getHeight(15, viewport)};
              `}
              onPress={this.tryToInvite(c)}
              disabled={invited}
            />
          ),
          notClickable: true
        })
      }
    }
    if (_.isEmpty(res)) {
      return [
        {
          key: 'empty',
          customContent: (
            <StyledText
              color={DUSK}
              fontSize={14}
              customStyle={'width: 100%; text-align: center;'}
            >
              {_.isEmpty(searchString) ? 'Empty' : 'No results'}
            </StyledText>
          ),
          notClickable: true
        }
      ]
    } else {
      return res
    }
  }

  save = () => {
    const { invitedSubs } = this.state
    const { onSelect } = this.props
    onSelect(invitedSubs)
    navigationService.goBack()
  }

  sections = () => {
    return [
      {
        customHeader: this.renderNewContactButton(),
        noBorder: true,
        data: []
      },
      ...this.renderMySubsSection(),
      {
        title: 'Contacts',
        data: this.contactsList()
      }
    ]
  }

  renderInvitationPanel = () => {
    const { invitationPanelVisible, inviteContact } = this.state
    return (
      <SendInvitationPanel
        key={_.get(inviteContact, 'id')}
        visible={invitationPanelVisible}
        onClose={this.toggleInvitationPanel}
        contact={inviteContact}
        onSelect={this.invite}
      />
    )
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
          title={{ title: 'Invited subs' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Done',
            handler: this.save
          }}
        />
        {this.renderSearchField()}
        <SectionList
          keyboardShouldPersistTaps='never'
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderCreateSubPanel()}
        {this.renderInvitationPanel()}
      </Page>
    )
  }
}

InvitedSubs.propTypes = {
  onSelect: PropTypes.func,
  invitedSubs: PropTypes.object
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  account: state.account
})

export default connect(mapStateToProps)(InvitedSubs)
