import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import generate from 'firebase-auto-ids'
import _ from 'lodash'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import Search from 'shared/components/inputs/Search'
import Textarea from 'shared/components/inputs/Textarea'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import EmailPhoneSelect from 'components/panels/EmailPhoneSelect'
import { getSubcontracts } from 'shared/utils/firebaseApis'

const MAX_LENGTH = 100
const MIN_SEARCH_LENGTH = 2

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class CreateSubContact extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      message: '',
      searchSubcontractors: [],
      emailsPhones: {},
      emailPhoneSelectVisible: false,
      loading: false
    }
    this.search = _.debounce(this.search, 500)
  }

  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  onSearchChange = (v) => {
    this.setState({ searchString: v.substring(0, MAX_LENGTH) })
    this.search(v)
  }

  search = async (text) => {
    if (text.length >= MIN_SEARCH_LENGTH) {
      this.setState({ loading: true })
      const res = await getSubcontracts(text)
      const result = this.renderCluesSubcontract(res)
      this.setState({ searchSubcontractors: result, loading: false })
    } else {
      this.setState({ searchSubcontractors: [], loading: false })
    }
  }

  renderCluesSubcontract = (array) => {
    const { viewport } = this.props
    if (array.length) {
      return array.slice(0, 15).map((item, index) => {
        const title = this.getTextForSearchResult(item)
        return {
          key: index,
          desc: title,
          onPress: () => this.onPressSearchResult(title),
          containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
        }
      })
    } else {
      return [{
        key: 'no_result',
        desc: 'Not found results',
        containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
      }]
    }
  }

  getTextForSearchResult = item => (
    `${item.name || item.business} (license #${item.license})`
  )

  onPressSearchResult = searchString => this.setState({ searchString, searchSubcontractors: [] })

  onChangePhone = (v) => this.setState({ phone: v })
  onChangeMessage = (v) => this.setState({ message: v })

  onInvite = () => {
    console.log('onInvite')
  }

  onChangeEmailPhone = id => v => {
    const { emailsPhones } = this.state
    this.setState({
      emailsPhones: {
        ...emailsPhones,
        [id]: {
          ...emailsPhones[id],
          value: v
        }
      }
    })
  }

  renderInviteButton = () => {
    const { viewport } = this.props
    return (
      <PrimaryButton
        color={AQUA_MARINE}
        customStyle={`
          height: ${getHeight(44, viewport)};
          width: ${getWidth(240, viewport)};
          margin-top: ${getHeight(50, viewport)};
          margin-bottom: ${getHeight(20, viewport)};
          align-self: center;
        `}
        title='Invite'
        onPress={this.onInvite}
      />
    )
  }

  sections = () => {
    const { searchString, phone, message, searchSubcontractors, loading } = this.state
    return [
      {
        title: 'Name',
        data: [
          {
            key: 'name',
            customContent: (
              <Search
                value={searchString}
                onChangeText={this.onSearchChange}
                placeholder='Lookup by name, business or license #'
                loading={loading}
              />
            )
          },
          ...searchSubcontractors
        ]
      },
      {
        title: 'Deliver to',
        data: [
          {
            title: 'Phone number',
            key: 'phone',
            actionField: (
              <SectionItemInput
                value={phone}
                onChangeText={this.onChangePhone}
                placeholder='#'
                keyboardType='phone-pad'
              />
            )
          },
          ...this.renderCustomEmailsPhones(),
          {
            title: 'Add  phone',
            addNewField: true,
            // onPress: this.toggleEmailPhoneSelect,
            onPress: () => this.addEmailOrPhone('phone'),
            key: 'add'
          }
        ]
      },
      {
        title: 'Message body',
        data: [
          {
            key: 'message',
            customContent: (
              <Textarea
                value={message}
                onChangeText={this.onChangeMessage}
                maxLength={140}
                customStyle='padding-horizontal: 0'
                placeholder='Hi James, I would like to invite you to bid on a project in Rancho Cucamonga.  I would need you to start in the next 5 days.'
              />
            )
          }
        ]
      },
      {
        customHeader: this.renderInviteButton(),
        noBorder: true,
        data: []
      }
    ]
  }

  renderCustomEmailsPhones = () => {
    const { emailsPhones } = this.state
    return _.map(emailsPhones, (ep, id) => ({
      title: ep.type === 'email' ? 'Email' : 'Phone number',
      key: id,
      actionField: (
        <SectionItemInput
          value={ep.value}
          onChange={this.onChangeEmailPhone(id)}
          placeholder={ep.type === 'email' ? 'email' : '#'}
          keyboardType={ep.type === 'email' ? 'email-address' : 'phone-pad'}
        />
      )
    }))
  }

  toggleEmailPhoneSelect = () => this.setState({ emailPhoneSelectVisible: !this.state.emailPhoneSelectVisible })

  renderEmailPhoneSelect = () => {
    const { emailPhoneSelectVisible } = this.state
    return (
      <EmailPhoneSelect
        visible={emailPhoneSelectVisible}
        onClose={this.toggleEmailPhoneSelect}
        onSelect={this.addEmailOrPhone}
        value={'email'}
      />
    )
  }

  addEmailOrPhone = (type) => {
    const { emailsPhones } = this.state
    const id = generate(_.now())
    this.setState({
      emailsPhones: {
        ...emailsPhones,
        [id]: {
          type: type,
          value: ''
        }
      }
    })
  }

  render () {
    const { viewport, visible, onClose } = this.props
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        percHeight={0.85}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Create sub contact' }}
            leftButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList
            sections={this.sections()}
          />
        </ModalContentWrapper>
        {this.renderEmailPhoneSelect()}
      </SlidingUpModal>
    )
  }
}

CreateSubContact.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

CreateSubContact.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(CreateSubContact)
