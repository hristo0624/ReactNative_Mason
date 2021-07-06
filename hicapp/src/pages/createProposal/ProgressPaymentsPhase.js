import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import moment from 'moment'
import generate from 'firebase-auto-ids'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE, CORAL } from 'shared/constants/colors'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import navigationService from 'shared/navigation/service'
import TextWithChevron from 'shared/components/sections/TextWithChevron'
import SectionTextarea from 'shared/components/sections/SectionTextarea'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import DatePicker from 'shared/components/modals/DatePicker'
import SectionDeleteButton from 'shared/components/sections/SectionDeleteButton'
import ConfirmationModal from 'shared/components/modals/ConfirmationModal'

@withMappedNavigationParams()
class ProgressPaymentsPhase extends Component {
  constructor (props) {
    super(props)
    const phase = _.get(props, 'phase', {})
    this.state = {
      datePickerVisible: false,
      id: generate(_.now()),
      name: '',
      cost: '',
      date: null,
      ...phase,
      errors: {}
    }
  }

  handleNameChange = (v) => {
    this.setState({
      name: v,
      errors: {}
    })
  }

  handleCostChange = (v) => {
    const { maxValue } = this.props
    if (v !== '') {
      let amount = _.round(v, 2)
      amount = _.isNaN(amount) ? 0 : amount
      amount = amount > maxValue ? maxValue : amount
      this.setState({
        cost: amount,
        errors: {}
      })
    } else {
      this.setState({ cost: v, errors: {} })
    }
  }

  toggleDatePicker = () => this.setState({ datePickerVisible: !this.state.datePickerVisible, errors: {} })

  sections = () => {
    const { name, cost, date, errors } = this.state
    const { phase } = this.props
    const strDate = date ? moment(date).format('MM/DD/YYYY') : ''
    const res = [
      {
        title: 'Phase of work:',
        data: [
          {
            title: 'Description',
            key: 'desc',
            error: errors.desc,
            customContent: (
              <SectionTextarea
                value={name}
                onChangeText={this.handleNameChange}
                maxLength={100}
                placeholder='Work or services to be performed or Materials to be supplied'
              />
            )
          },
          {
            title: 'Amount',
            desc: 'Amount of progress payment',
            key: 'cost',
            error: errors.cost,
            actionField: (
              <SectionItemInput
                value={_.toString(cost)}
                onChange={this.handleCostChange}
                blurValue={moneyWithSymbolAbbr(cost)}
              />
            )
          },
          {
            title: 'Date',
            desc: 'Estimated date',
            key: 'date',
            error: errors.date,
            onPress: this.toggleDatePicker,
            actionField: <TextWithChevron value={strDate} />
          }
        ]
      }
    ]
    if (phase) {
      res.push({
        data: [
          {
            customContent: this.renderDeleteButton(),
            key: 'delete',
            onPress: this.showPrompt,
            showBorder: false
          }
        ]
      })
    }
    return res
  }

  save = () => {
    const { id, name, cost, date } = this.state
    const { save } = this.props
    const errors = {}
    if (name === '') errors.name = 'Description cannot be blank'
    if (!cost || cost === '' || cost === 0) errors.cost = 'Amount cannot be 0'
    if (!date) errors.date = 'Date cannot be blank'
    if (moment().isAfter(moment(date))) errors.date = 'Date cannot be in the past'
    if (_.isEmpty(errors)) {
      const item = { id, name, cost, date }
      save(item)
      navigationService.goBack()
    } else {
      this.setState({ errors })
    }
  }

  onChangeDate = (d) => {
    // format is 2019-06-30
    const m = moment(d)
    this.setState({
      date: m.format('YYYY-MM-DD')
    })
    this.toggleDatePicker()
  }

  renderDatePickerModal = () => {
    const { datePickerVisible, date } = this.state
    return (
      <DatePicker
        isVisible={datePickerVisible}
        onConfirm={this.onChangeDate}
        hide={this.toggleDatePicker}
        date={date ? new Date(date) : new Date()}
      />
    )
  }

  renderDeleteButton = () => {
    return <SectionDeleteButton title={'Delete'} color={CORAL} />
  }

  showPrompt = () => this.setState({ deletePromptVisible: true })
  hideModal = () => this.setState({ deletePromptVisible: false })

  handleDelete = () => {
    const { remove } = this.props
    remove()
    this.hideModal()
    navigationService.goBack()
  }

  renderDeletePromptModal = () => {
    const { deletePromptVisible } = this.state
    return (
      <ConfirmationModal
        title={'Delete this phase?'}
        onReject={this.handleDelete}
        onApply={this.hideModal}
        onClose={this.hideModal}
        positiveTitle='cancel'
        negativeTitle='delete'
        isVisible={deletePromptVisible}
        showCancel={false}
      />
    )
  }

  render () {
    const { phase } = this.props
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: phase ? 'Edit phase of work' : 'New phase of work' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: phase ? 'Save' : 'Add',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderDatePickerModal()}
        {this.renderDeletePromptModal()}
      </Page>
    )
  }
}

ProgressPaymentsPhase.propTypes = {
  save: PropTypes.func,
  remove: PropTypes.func,
  phase: PropTypes.object,
  maxValue: PropTypes.number
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ProgressPaymentsPhase)
