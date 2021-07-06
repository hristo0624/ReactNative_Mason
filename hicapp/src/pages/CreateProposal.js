import React, { Component } from 'react'
import { connect } from 'react-redux'
import generate from 'firebase-auto-ids'
import _ from 'lodash'
import moment from 'moment'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import { AQUA_MARINE, PALE_GREY, WHITE } from 'shared/constants/colors'
import SectionList from 'shared/components/sections/SectionList'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import { fetchProposal, getLineItems } from 'controllers/data'
import {
  calculateProjectCost,
  getAmountToFinance,
  getBalanceDue,
  getProgressPaymentsSum,
  getUpdatedDepositValue,
  isProjectCostCalculated
} from 'shared/utils/proposal'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import TextWithChevron from 'shared/components/sections/TextWithChevron'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import DatePicker from '../../../shared/components/modals/DatePicker'

@withMappedNavigationParams()
class CreateProposal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      proposal: {
        id: generate(_.now()),
        owner: {
          mailingAddressSame: true
        },
        company: _.get(props, 'account.company', null),
        admins: {
          [props.user.id]: true
        }
      },
      plansOptions: [],
      showPreview: false,
      isLoading: true,
      isCalculated: false,
      selected: [],
      inputText: '',
      options: [],
      paymentPlanPanelVisible: false
    }
    if (_.has(props, 'user.signature')) {
      this.state.proposal.signature = {
        userId: _.get(props, 'user.id', null),
        name: _.get(props, 'user.profile.name', null),
        email: _.get(props, 'user.profile.email', null),
        url: _.get(props, 'user.signature', null)
      }
    }
    // console.log('Create proposal constructor', this.state.proposal)
  }

  static getDerivedStateFromProps = (props, state) => {
    const newState = {
      proposal: state.proposal
    }
    if (props.plans !== state.prevPlans) {
      const options = []
      const projectCost = _.get(state, 'proposal.projectCost')
      const sortedPlans = _.sortBy(_.values(props.plans), 'amount')
      for (const p of sortedPlans) {
        let label = projectCost ? `${p.amount} payments of ${moneyWithSymbolAbbr(projectCost / p.amount, '$')}` : `${p.amount} payments`
        if (p.amount === 0) label = 'No payment plan'
        const helpText = p.fee > 0 ? `${p.fee}% contractor fee` : 'No contractor fee'
        options.push({
          label,
          value: p.id,
          helpText,
          amount: p.amount
        })
      }
      newState.prevPlans = props.plans
      newState.plansOptions = options
      newState.proposal = {
        ...newState.proposal,
        plan: _.get(sortedPlans, 0)
      }
    }

    if (props.account !== state.prevAccount) {
      newState.prevAccount = props.account
      newState.proposal = {
        ...newState.proposal,
        company: _.get(props, 'account.company', null)
      }
    }

    // set default signature
    if (props.user !== state.prevUser && !_.has(state, 'proposal.signature')) {
      newState.prevUser = props.user
      const currentSignature = _.get(state, 'proposal.signature')
      if (!currentSignature && _.has(props, 'user.signature')) {
        newState.proposal = {
          ...newState.proposal,
          signature: {
            userId: _.get(props, 'user.id', null),
            name: _.get(props, 'user.profile.name', null),
            email: _.get(props, 'user.profile.email', null),
            url: _.get(props, 'user.signature', null)
          }
        }
      }
    }
    return newState
  }

  async componentDidMount () {
    const parentProposalId = _.get(this.props, 'parentProposalId')
    const lineItems = await getLineItems(this.props.account.id)
    if (parentProposalId) {
      const proposal = await fetchProposal(parentProposalId)
      let signature = _.get(proposal, 'siganture')
      if (!signature && _.has(this.props, 'user.signature')) {
        signature = {
          userId: _.get(this.props, 'user.id', null),
          name: _.get(this.props, 'user.name', null),
          email: _.get(this.props, 'user.email', null),
          url: _.get(this.props, 'user.signature', null)
        }
      }
      const newProposal = {
        ...proposal,
        id: generate(_.now()),
        signature
      }
      this.setState({
        lineItemsFromDb: lineItems,
        options: lineItems,
        proposal: newProposal,
        isLoading: false,
        isCalculated: isProjectCostCalculated(_.get(newProposal, 'lineItems', {})),
        plansOptions: this.updatePlanOptionsLabels(_.get(this.state, 'plansOptions', []), getAmountToFinance(newProposal))
      })
    } else {
      this.setState({
        lineItemsFromDb: lineItems,
        options: lineItems,
        isLoading: false
      })
    }
  }

  renderLineItems = () => {
    const { proposal } = this.state
    const lineItems = _.get(proposal, 'lineItems', {})
    return _.map(lineItems, (item, itemId) => {
      const quantity = _.get(item, 'quantity', 1)
      const cost = _.get(item, 'cost', 0)
      const desc = `${quantity} x ${moneyWithSymbolAbbr(cost)}`
      let actionField
      if (cost > 0) {
        actionField = (
          <TextWithChevron
            value={moneyWithSymbolAbbr(cost * quantity)}
          />
        )
      }
      return {
        title: item.name,
        key: itemId,
        desc: cost > 0 ? desc : null,
        actionField: actionField,
        onPress: this.editLineItem(item)
      }
    })
  }

  addLineItem = (newLineItem) => {
    const { proposal, plansOptions, errors } = this.state
    const curLineItems = _.get(proposal, 'lineItems', [])
    let cost = _.get(newLineItem, 'cost', 0)
    if (cost < 0) cost = 0
    newLineItem.cost = _.round(cost, 2)
    const newLineItems = {
      ...curLineItems,
      [newLineItem.id]: newLineItem
    }
    console.log('newLineItems', newLineItems)
    const isCalculated = isProjectCostCalculated(newLineItems)
    const newProjectCost = isCalculated ? calculateProjectCost(newLineItems) : proposal.projectCost
    const newProposal = {
      ...proposal,
      lineItems: newLineItems,
      projectCost: newProjectCost,
      deposit: getUpdatedDepositValue(newProjectCost, proposal.deposit)
    }
    const newState = {
      proposal: newProposal,
      isCalculated,
      newLineItem: {},
      plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(newProposal))
    }
    if (_.get(errors, 'projectCost') && newProjectCost > 0) {
      newState.errors = _.omit(errors, 'projectCost')
    }
    this.setState(newState)
  }

  onAddLineItemClick = () => {
    console.log('onAddLineItem click')
    navigationService.push(screens.CREATE_LINE_ITEM, { addItem: this.addLineItem })
  }

  onSetPaymentMethodClick = () => {
    const { proposal } = this.state
    const options = {
      save: this.saveSetPaymentPlan,
      proposal
    }
    navigationService.push(screens.SET_PAYMENT_PLAN, { options })
  }

  deleteItem = (lineItemId) => {
    const { proposal, plansOptions } = this.state
    const curLineItems = _.get(proposal, 'lineItems', {})
    const lineItemsCopy = { ...curLineItems }
    delete lineItemsCopy[lineItemId]
    const isCalculated = isProjectCostCalculated(lineItemsCopy)
    const newProjectCost = isCalculated ? calculateProjectCost(lineItemsCopy) : proposal.projectCost
    const newProposal = {
      ...proposal,
      lineItems: lineItemsCopy,
      projectCost: newProjectCost,
      deposit: getUpdatedDepositValue(newProjectCost, proposal.deposit)
    }
    this.setState({
      proposal: newProposal,
      isCalculated,
      plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(newProposal))
    })
  }

  editLineItem = (item) => () => {
    console.log('edit line item', item)
    navigationService.push(screens.CREATE_LINE_ITEM, { addItem: this.addLineItem, item, delItem: this.deleteItem })
  }

  updatePlanOptionsLabels = (curPlanOptions, amountToFinance) => {
    return []
  }

  saveSetPaymentPlan = (proposal) => {
    return this.setState({ proposal })
  }

  handleChange = fieldName => v => {
    console.log('handle change', fieldName, v)
    const { plans } = this.props
    const { plansOptions, proposal } = this.state
    const proposalCopy = { ...proposal }
    const toNumber = (fieldName === 'projectCost') && v !== ''
    const val = toNumber ? _.round(v, 2) : v
    _.set(proposalCopy, fieldName, val)
    // set plan to 'none' if amountToFinance === 0
    if (_.get(proposalCopy, 'amountToFinance') === 0) {
      _.set(proposalCopy, 'plan', plans.none)
    }
    // console.log('handle change, proposal copy', proposalCopy)
    if (fieldName === 'projectCost' || fieldName === 'deposit' || fieldName === 'amountToFinance') {
      // deposit
      const deposit = getUpdatedDepositValue(_.get(proposalCopy, 'projectCost'), proposalCopy.deposit)
      _.set(proposalCopy, 'deposit', deposit)

      // amountToFinance
      let amountToFinance = _.get(proposalCopy, 'amountToFinance')
      const balanceDue = getBalanceDue(proposalCopy)
      if (!_.isNil(amountToFinance) && amountToFinance > balanceDue) {
        amountToFinance = balanceDue
      }
      _.set(proposalCopy, 'amountToFinance', amountToFinance)

      // progressPayments
      const progressPayments = _.get(proposalCopy, 'progressPayments')
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      const nonFinancedAmount = balanceDue - _.get(proposalCopy, 'amountToFinance', 0)
      if (progressPaymentsSum > nonFinancedAmount) {
        _.set(proposalCopy, 'progressPayments', {})
      }
      console.log('proposalCopy', proposalCopy)
      this.setState({
        proposal: proposalCopy,
        plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(proposalCopy))
      })
    } else {
      console.log('proposalCopy', proposalCopy)
      this.setState({ proposal: proposalCopy })
    }
  }

  editDeposit = () => {
    const { proposal } = this.state
    const params = {
      deposit: _.get(proposal, 'deposit'),
      projectCost: _.get(proposal, 'projectCost', 0),
      onSave: this.handleChange('deposit')
    }
    navigationService.push(screens.EDIT_DEPOSIT, params)
  }

  renderDepositField = () => {
    const { proposal } = this.state
    const projectCost = _.get(proposal, 'projectCost', 0)
    const depositValue = _.get(proposal, 'deposit.value', 0)
    const depositPerc = _.get(proposal, 'deposit.perc', 0)
    if (depositValue > 0) {
      return {
        title: 'Add down payment',
        key: 'deposit',
        desc: `(${depositPerc}%)`,
        actionField: <TextWithChevron value={moneyWithSymbolAbbr(depositValue)} />,
        onPress: this.editDeposit
      }
    } else {
      return {
        title: 'Add down payment',
        key: 'add deposit',
        onPress: this.editDeposit,
        addNewField: true,
        disabled: projectCost <= 0
      }
    }
  }

  scopeOfWorkSection = () => {
    return {
      title: 'SCOPE OF WORK',
      data: [
        ...this.renderLineItems(),
        {
          title: 'Add line item',
          key: 'new',
          onPress: this.onAddLineItemClick,
          addNewField: true
        }
      ],
      isFirst: true
    }
  }

  renderStartDatePickerModal = () => {
    const { activeDatePicker, proposal } = this.state
    const date = _.get(proposal, 'startDate', null)
    return (
      <DatePicker
        saveText={'Apply'}
        cancelText={'Cancel'}
        minimumDate={new Date()}
        isVisible={activeDatePicker === 'startDate'}
        onConfirm={(d) => this.onChangeDate(d, 'startDate')}
        hide={this.toggleDatePicker}
        date={date ? new Date(date) : new Date()}
      />
    )
  }

  renderEndDatePickerModal = () => {
    const { activeDatePicker, proposal } = this.state
    const date = _.get(proposal, 'endDate', null)
    const startDate = _.get(proposal, 'startDate', null)
    return (
      <DatePicker
        saveText={'Apply'}
        cancelText={'Cancel'}
        minimumDate={startDate ? new Date(startDate) : new Date()}
        isVisible={activeDatePicker === 'endDate'}
        onConfirm={(d) => this.onChangeDate(d, 'endDate')}
        hide={this.toggleDatePicker}
        date={date ? new Date(date) : new Date()}
      />
    )
  }

  onChangeDate = (d) => {
    // format is 2019-06-30
    const { activeDatePicker } = this.state
    const m = moment(d)
    this.handleChange(activeDatePicker)(m.format('YYYY-MM-DD'))
    this.toggleDatePicker()
  }

  projectTimeLineSection = () => {
    const { proposal, errors } = this.state
    const startDate = _.get(proposal, 'startDate')
    const formattedStartDate = startDate ? moment(startDate).format('MM/DD/YYYY') : ''

    const endDate = _.get(proposal, 'endDate')
    const formattedEndDate = endDate ? moment(endDate).format('MM/DD/YYYY') : ''
    return {
      title: 'PROJECT TIMELINE',
      data: [
        {
          title: 'Approximate start',
          key: 'startDate',
          error: _.get(errors, 'startDate'),
          onPress: () => {
            this.resetError('startDate')()
            this.toggleDatePicker('startDate')
          },
          actionField: <TextWithChevron value={formattedStartDate} />
        },
        {
          title: 'Approximate completion',
          key: 'endDate',
          error: _.get(errors, 'endDate'),
          onPress: () => {
            this.resetError('endDate')()
            this.toggleDatePicker('endDate')
          },
          actionField: <TextWithChevron value={formattedEndDate} />
        }
      ]
    }
  }

  toggleDatePicker = (dateType) => {
    const { activeDatePicker } = this.state
    if (activeDatePicker) {
      return this.setState({ activeDatePicker: null })
    }
    return this.setState({ activeDatePicker: dateType })
  }

  projectCostSection = () => {
    const { proposal, isCalculated, errors } = this.state
    const projectCost = _.get(proposal, 'projectCost', 0)
    return {
      title: 'TOTAL',
      data: [
        {
          title: 'Project amount',
          key: 'project_amount',
          disabled: isCalculated,
          error: _.get(errors, 'projectCost'),
          actionField: (
            <SectionItemInput
              disabled={isCalculated}
              value={projectCost ? projectCost.toString() : ''}
              onChange={this.handleChange('projectCost')}
              onComplete={this.handleChange('projectCost')}
              keyboardType='numeric'
              placeholder='$0'
              focused={false}
              blurValue={projectCost ? moneyWithSymbolAbbr(projectCost) : ''}
              onFocus={this.resetError('projectCost')}
            />
          )
        }
      ]
    }
  }

  projectAddressSection = () => {
    const { proposal, errors } = this.state
    return {
      title: 'PROJECT ADDRESS',
      data: [
        {
          title: 'Project address',
          desc: _.get(proposal, 'address.description'),
          key: 'address',
          error: _.get(errors, 'address'),
          onPress: this.toProjectAddressPage
        }
      ]
    }
  }

  homeownerDetailsSection = () => {
    const { proposal, errors } = this.state
    const mailingAddressSame = _.get(proposal, 'owner.mailingAddressSame')
    const mAddress = mailingAddressSame ? _.get(proposal, 'address.description') : _.get(proposal, 'owner.mailingAddress.description')
    return {
      title: 'homeowner details',
      data: [
        {
          title: 'First name',
          key: 'ownerFirstName',
          error: _.get(errors, 'ownerFirstName'),
          actionField: (
            <SectionItemInput
              value={_.get(proposal, 'owner.firstName')}
              onChange={this.handleChange('owner.firstName')}
              onFocus={this.resetError('ownerFirstName')}
            />
          )
        },
        {
          title: 'Last name',
          key: 'ownerLastName',
          error: _.get(errors, 'ownerLastName'),
          actionField: (
            <SectionItemInput
              value={_.get(proposal, 'owner.lastName')}
              onChange={this.handleChange('owner.lastName')}
              onFocus={this.resetError('ownerLastName')}
            />
          )
        },
        {
          title: 'Contact phone number',
          key: 'phone',
          actionField: (
            <SectionItemInput
              value={_.get(proposal, 'owner.phone')}
              onChange={this.handleChange('owner.phone')}
            />
          )
        },
        {
          title: 'Contact email',
          key: 'email',
          actionField: (
            <SectionItemInput
              value={_.get(proposal, 'owner.email')}
              onChange={this.handleChange('owner.email')}
            />
          )
        },
        {
          title: 'Mailing address',
          desc: mAddress,
          key: 'mailingAddress',
          onPress: this.toMailingAddressPage
        }
      ]
    }
  }

  resetError = (name) => () => {
    const { errors } = this.state
    const errorsCopy = { ...errors }
    delete errorsCopy[name]
    this.setState({ errors: errorsCopy })
  }

  handleChangeAddress = (a) => {
    const { proposal, errors } = this.state
    this.setState({
      proposal: {
        ...proposal,
        address: _.get(a, 'address', null),
        appointment: _.get(a, 'appointment', null)
      },
      errors: {
        ...errors,
        address: null
      }
    })
  }

  toProjectAddressPage = () => {
    const { proposal } = this.state
    const address = _.get(proposal, 'address')
    const appointment = _.get(proposal, 'appointment')
    const options = {
      address,
      appointment,
      save: this.handleChangeAddress
    }
    navigationService.push(screens.PROJECT_ADDRESS, options)
  }

  handleChangeMailingAddress = (a) => {
    const { proposal } = this.state
    this.setState({
      proposal: {
        ...proposal,
        owner: {
          ...proposal.owner,
          mailingAddress: _.get(a, 'address', null),
          mailingAppointment: _.get(a, 'appointment', null),
          mailingAddressSame: a.mailingAddressSame
        }
      }
    })
  }

  toMailingAddressPage = () => {
    const { proposal } = this.state
    const mailingAddressSame = _.get(proposal, 'owner.mailingAddressSame', false)
    const options = {
      address: _.get(proposal, 'owner.mailingAddress'),
      appointment: _.get(proposal, 'owner.mailingAppointment'),
      mailingAddressSame,
      save: this.handleChangeMailingAddress
    }
    navigationService.push(screens.MAILING_ADDRESS, options)
  }

  paymentPlanSection = () => {
    return {
      title: 'PAYMENTS',
      data: [
        this.renderDepositField(),
        {
          title: 'Set payment plan',
          key: 'paymentPlan',
          onPress: this.onSetPaymentMethodClick,
          wallet: true
        }
      ]
    }
  }

  toAgreements = () => {
    const { proposal } = this.state
    const agreements = _.get(proposal, 'agreements', [])
    const options = {
      agreements,
      onChange: this.handleChange('agreements')
    }
    navigationService.push(screens.AGREEMENTS, options)
  }

  agreementsSection = () => {
    // const { proposal } = this.state
    const { agreementsDict } = this.props
    const { proposal } = this.state
    const agreements = _.get(proposal, 'agreements')
    const items = _.map(agreements, agrId => ({
      title: _.get(agreementsDict, [agrId, 'title']),
      key: agrId,
      onPress: this.toAgreements
    }))
    if (items.length < _.size(agreementsDict)) {
      items.push({
        title: 'Add agreement',
        key: 'new',
        onPress: this.toAgreements,
        addNewField: true
      })
    }
    return {
      title: 'AGREEMENTS',
      data: items
    }
  }

  toSignaturePage = () => {
    const { proposal } = this.state
    const options = {
      signature: _.get(proposal, 'signature', {}),
      onChange: this.handleChange('signature')
    }
    navigationService.push(screens.PROPOSAL_SIGNATURE, options)
  }

  signatureSection = () => {
    const { proposal } = this.state
    const signature = _.get(proposal, 'signature')
    // console.log('signature section', signature)
    let desc = _.get(signature, 'name')
    if (!desc) desc = _.get(signature, 'email')
    return {
      title: 'SIGNATURE',
      data: [
        {
          title: 'Signer',
          key: 'signer',
          desc: desc,
          onPress: this.toSignaturePage
        }
      ]
    }
  }

  sections = () => {
    return [
      this.projectAddressSection(),
      this.homeownerDetailsSection(),
      this.scopeOfWorkSection(),
      this.projectCostSection(),
      this.projectTimeLineSection(),
      this.paymentPlanSection(),
      this.agreementsSection(),
      this.signatureSection()
    ]
  }

  continue = () => {
    const { proposal } = this.state
    console.log('Continue', proposal)
    // handleErrors
    const errors = {}
    const projectCost = _.get(proposal, 'projectCost', 0)
    if (projectCost <= 0) errors.projectCost = 'Contract amount must be greater than 0'

    const address = _.get(proposal, 'address')
    if (!_.isObject(address)) errors.address = 'Address can not be blank'

    const ownerFirstName = _.get(proposal, 'owner.firstName')
    if (_.isNil(ownerFirstName) || _.isEmpty(ownerFirstName)) errors.ownerFirstName = `Enter owner's first name`

    const ownerLastName = _.get(proposal, 'owner.lastName')
    if (_.isNil(ownerLastName) || _.isEmpty(ownerLastName)) errors.ownerLastName = `Enter owner's last name`

    const signature = _.get(proposal, 'signature')
    if (!_.isObject(signature)) errors.signature = 'Signature is not set'

    const startDate = _.get(proposal, 'startDate')
    if (_.isNil(startDate)) errors.startDate = 'Start date is not set'

    const endDate = _.get(proposal, 'endDate')
    if (_.isNil(endDate)) errors.endDate = 'Completion date is not set'

    console.log('errors', errors)
    if (_.isEmpty(errors)) {
      console.log('go next')
    } else {
      this.setState({ errors: errors })
    }
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
          title={{ title: 'Create proposal' }}
          leftButton={<BackButton />}
          rightButton={{ title: 'Next', tintColor: AQUA_MARINE, handler: this.continue }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderStartDatePickerModal()}
        {this.renderEndDatePickerModal()}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user,
  plans: _.get(state, 'references.plans', {}),
  account: state.account,
  sameAsCashFee: _.get(state, 'references.sameAsCashFee', '...'),
  agreementsDict: _.get(state, 'references.agreements')
})

export default connect(mapStateToProps)(CreateProposal)
