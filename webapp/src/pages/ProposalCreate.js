import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Form,
  FormLayout,
  Icon,
  Layout,
  Page,
  PageActions,
  ResourceList,
  Stack,
  TextField,
  TextStyle
} from '@shopify/polaris'
import generate from 'firebase-auto-ids'

import PageLayout from 'components/pageStructure/PageLayout'
import AddressAutocomplete from 'components/common/AddressAutocomplete'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import history from 'src/history'
import ProposalPreview from 'pages/ProposalPreview'
import MoneyTextField from 'components/common/MoneyTextField'
import { deleteLineItem, fetchProposal } from 'controllers/data'
import ProposalSignature from 'components/proposalCreate/ProposalSignature'
import ProposalAddendums from 'components/proposalCreate/ProposalAddendums'
import ProposalPaymentPlans from 'components/proposalCreate/ProposalPaymentPlans'
import ProposalEstimatedCost from 'components/proposalCreate/ProposalEstimatedCost'
import {
  calculateProjectCost,
  getAmountToFinance,
  getBalanceDue,
  getProgressPaymentsSum,
  getUpdatedDepositValue,
  isProjectCostCalculated
} from 'shared/utils/proposal'
import ProposalAgreements from 'components/proposalCreate/ProposalAgreements'
import ProposalFinancing from 'components/proposalCreate/ProposalFinancing'
import ProjectTimeline from 'components/proposalCreate/ProjectTimeline'

const extractLineItemsFromState = (state) => {
  const lineItems = _.get(state, 'lineItems')
  const accountId = _.get(state, 'account.id')
  return _.keys(lineItems)
    .map(lineItemKey => lineItems[lineItemKey])
    .map(lineItemValue => ({
      value: lineItemValue.name,
      label: lineItemValue.name,
      key: lineItemValue.id,
      media: (
        <div
          onClick={e => {
            e.stopPropagation()
            return deleteLineItem(accountId, lineItemValue.id)
          }}
        >
          <Icon
            source='delete'
          />
        </div>
      )
    }))
}

class ProposalCreate extends Component {
  constructor (props) {
    super(props)
    console.log('props.lineItems', props.lineItems)
    this.state = {
      proposal: {
        id: generate(_.now()),
        owner: {
          mailingAddressSame: true
        },
        company: _.get(props, 'account.company', null)
      },
      newLineItem: {},
      plansOptions: [],
      showPreview: false,
      isLoading: true,
      isCalculated: false,
      selected: [],
      inputText: '',
      selectedLineItems: [],
      options: props.lineItems,
      lineItemsFromDb: props.lineItems,
      errors: {}
    }
    if (_.has(props, 'user.signature')) {
      this.state.proposal.signature = {
        userId: _.get(props, 'user.id', null),
        name: _.get(props, 'user.profile.name', null),
        email: _.get(props, 'user.profile.email', null),
        url: _.get(props, 'user.signature', null)
      }
    }
    if (_.has(props, 'user.id')) {
      this.state.proposal.admins = {
        [props.user.id]: true
      }
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    const newState = {
      proposal: state.proposal
    }
    if (props.plans !== state.prevPlans) {
      const options = []
      const sortedPlans = _.sortBy(_.values(props.plans), 'amount')
      const amountToFinance = getAmountToFinance(state.proposal)
      for (const p of sortedPlans) {
        let label = amountToFinance > 0 ? `${p.amount} payments of ${moneyWithSymbolAbbr(amountToFinance / p.amount, '$')}` : `${p.amount} payments`
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

    if (!state.options.every(val => props.lineItems.includes(val))) {
      newState.options = props.lineItems
    }

    // set default signature
    if (_.has(props, 'user.id') && props.user !== state.prevUser && _.isNil(state.prevUser)) {
      console.log('GDSFP =>>> set default signature and admin')
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
      _.set(newState, ['proposal.admins', props.user.id], true)
    }
    return newState
  }

  async componentDidMount () {
    const parentProposalId = _.get(this.props, 'location.state.parentProposalId')
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
        isLoading: false,
        isCalculated: isProjectCostCalculated(_.get(newProposal, 'lineItems', {})),
        plansOptions: this.updatePlanOptionsLabels(_.get(this.state, 'plansOptions', []), getAmountToFinance(newProposal))
      })
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  updatePlanOptionsLabels = (curPlanOptions, amountToFinance) => {
    console.log('updatePlanOptionsLabels', curPlanOptions, amountToFinance)
    const newPlansOptions = _.map(curPlanOptions, o => {
      if (o.amount > 0) {
        const ppm = _.round(amountToFinance / o.amount, 2)
        return {
          ...o,
          label: amountToFinance ? `${o.amount} payments of ${moneyWithSymbolAbbr(ppm, '$')}` : `${o.amount} payments`,
          disabled: amountToFinance.toString() === '0'
        }
      } else {
        return o
      }
    })
    return newPlansOptions
  }

  handleChange = fieldName => v => {
    console.log('handle change', fieldName, v)
    const { plans } = this.props
    const { plansOptions, proposal } = this.state
    const proposalCopy = { ...proposal }
    const toNumber = (fieldName === 'projectCost' && v !== '')
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
        _.set(proposalCopy, 'amountToFinance', amountToFinance)
      }

      // progressPayments
      const progressPayments = _.get(proposalCopy, 'progressPayments')
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      const nonFinancedAmount = balanceDue - _.get(proposalCopy, 'amountToFinance', 0)
      if (progressPaymentsSum > nonFinancedAmount) {
        _.set(proposalCopy, 'progressPayments', {})
      }

      this.setState({
        proposal: proposalCopy,
        plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(proposalCopy))
      })
    } else {
      this.setState({ proposal: proposalCopy })
    }
  }

  renderEstimatedProjectCost = () => {
    const { proposal, isCalculated, errors } = this.state
    return (
      <ProposalEstimatedCost
        proposal={proposal}
        isCalculated={isCalculated}
        handleChange={this.handleChange}
        errors={errors}
        resetError={this.resetError}
      />
    )
  }

  renderLineItem = (item) => {
    // const shortcutActions = [{ icon: 'delete', onAction: this.removeLineItem(item.id) }]
    const quantity = _.get(item, 'quantity', 1)
    const cost = _.get(item, 'cost', 0)
    return (
      <ResourceList.Item
        key={item.id}
        id={item.id}
      // shortcutActions={shortcutActions}
      // media={<Icon size='big' source='products' />}
      >
        <Stack distribution='equalSpacing'>
          <Stack spacing='extraTight'>
            <h3>
              <TextStyle variation='strong'>
                {item.name}
              </TextStyle>
            </h3>
            {cost > 0 ? <span>{`(${quantity} x ${moneyWithSymbolAbbr(cost)})`}</span> : null}
          </Stack>
          <h3>
            <TextStyle variation='strong'>
              {cost > 0 ? moneyWithSymbolAbbr(cost * quantity, '$') : null}
            </TextStyle>
          </h3>
        </Stack>

      </ResourceList.Item>
    )
  }

  addLineItem = () => {
    const { newLineItem, proposal, plansOptions } = this.state
    if (_.has(newLineItem, 'name')) {
      const curLineItems = _.get(proposal, 'lineItems', [])
      const lineItemId = generate(_.now())
      _.set(newLineItem, 'id', lineItemId)
      let cost = _.get(newLineItem, 'cost', 0)
      if (cost < 0) cost = 0
      newLineItem.cost = _.round(cost, 2)
      const newLineItems = {
        ...curLineItems,
        [lineItemId]: newLineItem
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
      this.setState({
        proposal: newProposal,
        isCalculated,
        newLineItem: {},
        plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(newProposal))
      })
    }
  }

  handleNewLineItemChange = fieldName => (v) => this.setState({
    newLineItem: {
      ...this.state.newLineItem,
      [fieldName]: v
    }
  })

  updateLineItemText = (newValue) => {
    console.log('newValue', newValue)
    this.handleNewLineItemChange('name')(newValue)
    this.filterAndUpdateOptions(newValue)
  };

  filterAndUpdateOptions = (inputString) => {
    console.log('inputString', inputString)
    if (inputString === '') {
      this.setState({
        options: this.props.lineItems
      })
      return
    }

    const filterRegex = new RegExp(inputString, 'i')
    const resultOptions = this.props.lineItems.filter((option) =>
      option.label.match(filterRegex)
    )
    console.log('new result options', resultOptions)
    this.setState({
      options: resultOptions
    })
  };

  updateSelection = (selected) => {
    console.log('selected', selected)
    const selectedText = selected.map((selectedItem) => {
      const matchedOption = this.props.lineItems.find((option) => {
        return option.value.match(selectedItem)
      })
      return matchedOption && matchedOption.label
    })
    this.handleNewLineItemChange('name')(selectedText[0])
    this.setState({ selected, inputText: selectedText[0] })
  }

  deleteLineItems = () => {
    const { proposal, plansOptions, selectedLineItems } = this.state
    const curLineItems = _.get(proposal, 'lineItems', {})
    const lineItemsCopy = { ...curLineItems }
    for (const itemId of selectedLineItems) {
      delete lineItemsCopy[itemId]
    }
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
      plansOptions: this.updatePlanOptionsLabels(plansOptions, getAmountToFinance(newProposal)),
      selectedLineItems: []
    })
  }

  handleSelectionLineItemsChange = (selectedItems) => {
    console.log('handleSelectionLineItemsChange', selectedItems)
    this.setState({ selectedLineItems: selectedItems })
  }

  renderScopeOfWork = () => {
    const { proposal, newLineItem, selectedLineItems, isCalculated, errors } = this.state
    const lineItems = _.get(proposal, 'lineItems', [])
    const resourceName = {
      singular: 'item',
      plural: 'items'
    }
    return (
      <Layout.AnnotatedSection
        title='Scope of work'
      >
        <Card
          title='Project line items'
        >
          <Card.Section>
            <ResourceList
              resourceName={resourceName}
              items={_.values(lineItems)}
              renderItem={this.renderLineItem}
              promotedBulkActions={[{ content: 'Delete', onAction: this.deleteLineItems }]}
              selectedItems={selectedLineItems}
              onSelectionChange={this.handleSelectionLineItemsChange}
            />
          </Card.Section>
          <Card.Section subdued>
            <Form onSubmit={this.addLineItem}>
              <FormLayout>
                <Autocomplete
                  options={this.state.options}
                  selected={this.state.selected}
                  onSelect={this.updateSelection}
                  textField={(
                    <Autocomplete.TextField
                      onChange={this.updateLineItemText}
                      label='Line item name'
                      value={_.get(newLineItem, 'name')}
                      placeholder='Remove appliances'
                    />
                  )}
                />
                <TextField
                  value={_.get(newLineItem, 'desc')}
                  onChange={this.handleNewLineItemChange('desc')}
                  label='Description (optional)'
                  type='text'
                  multiline={3}
                />
                <FormLayout.Group>
                  <TextField
                    value={_.get(newLineItem, 'quantity')}
                    onChange={this.handleNewLineItemChange('quantity')}
                    label='Quantity (optional)'
                    type='number'
                  />
                  <MoneyTextField
                    value={_.get(newLineItem, 'cost')}
                    onChange={this.handleNewLineItemChange('cost')}
                    label='Cost (optional)'
                  />
                </FormLayout.Group>
                <Button submit>Add</Button>
              </FormLayout>
            </Form>
          </Card.Section>
          <Card.Section>
            <MoneyTextField
              label='Project cost'
              onChange={this.handleChange('projectCost')}
              value={_.toString(_.get(proposal, 'projectCost', '0'))}
              disabled={isCalculated}
              error={_.get(errors, 'projectCost')}
              onFocus={this.resetError('projectCost')}
            />
          </Card.Section>
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderProjectAddress = () => {
    const { proposal, errors } = this.state
    return (
      <Layout.AnnotatedSection
        title='Project address'
        sectioned
      >
        <Card sectioned>
          <FormLayout>
            <AddressAutocomplete
              label='Street'
              onSelect={this.handleChange('address')}
              value={_.get(proposal, 'address')}
              error={_.get(errors, 'address')}
              onFocus={this.resetError('address')}
            />
            <TextField
              label='Apt, suite, etc. (optional)'
              value={_.get(proposal, 'apartment')}
              onChange={this.handleChange('apartment')}
            />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderMailingAddress = () => {
    const { proposal } = this.state
    const mailingAddressSame = _.get(proposal, 'owner.mailingAddressSame', false)
    if (!mailingAddressSame) {
      return (
        <Card.Section subdued>
          <FormLayout>
            <AddressAutocomplete
              label='Mailing address'
              onSelect={this.handleChange('owner.mailngAddress')}
              value={_.get(proposal, 'owner.mailngAddress')}
            />
            <TextField
              label='Apt, suite, etc. (optional)'
              value={_.get(proposal, 'owner.apartment')}
              onChange={this.handleChange('owner.apartment')}
            />
          </FormLayout>
        </Card.Section>
      )
    }
  }

  resetError = (name) => () => {
    const { errors } = this.state
    const errorsCopy = { ...errors }
    delete errorsCopy[name]
    this.setState({ errors: errorsCopy })
  }

  renderHomeOwnerDetails = () => {
    const { proposal, errors } = this.state
    return (
      <Layout.AnnotatedSection
        title='Homeowner details'
        sectioned
      >
        <Card>
          <Card.Section>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label='First name'
                  value={_.get(proposal, 'owner.firstName')}
                  onChange={this.handleChange('owner.firstName')}
                  error={_.get(errors, 'ownerFirstName')}
                  onFocus={this.resetError('ownerFirstName')}
                />
                <TextField
                  label='Last name'
                  value={_.get(proposal, 'owner.lastName')}
                  onChange={this.handleChange('owner.lastName')}
                  error={_.get(errors, 'ownerLastName')}
                  onFocus={this.resetError('ownerLastName')}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label='Contact phone number'
                  value={_.get(proposal, 'owner.phone')}
                  onChange={this.handleChange('owner.phone')}
                  type='tel'
                />
                <TextField
                  name='email'
                  label='Contact email'
                  value={_.get(proposal, 'owner.email')}
                  onChange={this.handleChange('owner.email')}
                  type='email'
                />
              </FormLayout.Group>
              <Checkbox
                checked={_.get(proposal, 'owner.mailingAddressSame')}
                label='Mailing address same as project address?'
                onChange={this.handleChange('owner.mailingAddressSame')}
              />
            </FormLayout>
          </Card.Section>
          {this.renderMailingAddress()}
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderPaymentPlans = () => {
    const { proposal, plansOptions } = this.state
    return (
      <ProposalPaymentPlans
        proposal={proposal}
        handleChange={this.handleChange}
        plansOptions={plansOptions}
      />
    )
  }

  renderAgreements = () => {
    const { proposal, errors } = this.state
    return (
      <ProposalAgreements
        agreements={_.get(proposal, 'agreements', [])}
        erorrs={errors}
        resetError={this.resetError}
        handleChange={this.handleChange}
      />
    )
  }

  renderShare = () => {
    const { proposal } = this.state
    return (
      <Layout.AnnotatedSection
        title='Share with homeowner'
        sectioned
      >
        <Card sectioned>
          <FormLayout>
            <TextField
              label='Send to this phone'
              value={_.get(proposal, 'share.phone', _.get(proposal, 'owner.phone'))}
              onChange={this.handleChange('share.phone')}
              type='tel'
            />
            <TextField
              label='Send to this email'
              value={_.get(proposal, 'share.email', _.get(proposal, 'owner.email'))}
              onChange={this.handleChange('share.email')}
              type='email'
            />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    )
  }

  renderSignature = () => {
    const { proposal, errors } = this.state
    return (
      <ProposalSignature
        proposal={proposal}
        onChange={this.handleChange('signature')}
        errors={errors}
        resetError={this.resetError}
      />
    )
  }

  renderAddendums = () => {
    const { proposal } = this.state
    return (
      <ProposalAddendums
        proposal={proposal}
        onChange={this.handleChange('addendums')}
      />
    )
  }

  renderFinancing = () => {
    const { proposal } = this.state
    return (
      <ProposalFinancing
        proposal={proposal}
        handleChange={this.handleChange}
      />
    )
  }

  renderProjectTimeline = () => {
    const { proposal, errors } = this.state
    return (
      <ProjectTimeline
        proposal={proposal}
        handleChange={this.handleChange}
        errors={errors}
        resetError={this.resetError}
      />
    )
  }

  togglePreview = () => {
    const { proposal, showPreview } = this.state
    console.log('Continue', proposal)
    // handleErrors
    const errors = {}
    const projectCost = _.get(proposal, 'projectCost', 0)
    if (projectCost <= 0) errors.projectCost = 'Project cost must be greater than 0'

    const address = _.get(proposal, 'address')
    if (!_.isObject(address)) errors.address = 'Address can not be blank, use autocompletion to set the address'

    const ownerFirstName = _.get(proposal, 'owner.firstName')
    if (_.isNil(ownerFirstName) || _.isEmpty(ownerFirstName)) errors.ownerFirstName = `Enter owner's first name`

    const ownerLastName = _.get(proposal, 'owner.lastName')
    if (_.isNil(ownerLastName) || _.isEmpty(ownerLastName)) errors.ownerLastName = `Enter owner's last name`

    const signature = _.get(proposal, 'signature')
    if (!_.isObject(signature)) errors.signature = 'Signature is not set'

    if (!_.has(proposal, 'startDate')) errors.startDate = `Set approximate start date`
    if (!_.has(proposal, 'endDate')) errors.endDate = `Set approximate completion date`

    console.log('errors', errors)
    if (_.isEmpty(errors) || showPreview) {
      this.setState({ showPreview: !this.state.showPreview })
    } else {
      this.setState({ errors: errors })
    }
  }

  back = () => {
    console.log('back')
    history.push('/proposals')
  }

  renderContent () {
    return (
      <Layout>
        {this.renderScopeOfWork()}
        {this.renderProjectTimeline()}
        {
          // this.renderEstimatedProjectCost()
        }
        {this.renderFinancing()}
        {this.renderProjectAddress()}
        {this.renderHomeOwnerDetails()}
        {
          // this.renderPaymentPlans()
        }
        {this.renderAgreements()}
        {this.renderSignature()}
        {this.renderAddendums()}
        {this.renderShare()}
      </Layout>
    )
  }

  render () {
    const { showPreview, proposal } = this.state
    if (showPreview) {
      return (
        <ProposalPreview
          back={this.togglePreview}
          proposal={proposal}
        />
      )
    } else {
      return (
        <PageLayout>
          <Page
            separator
            // fullWidth
            breadcrumbs={[{ content: 'Back', onAction: this.back }]}
            title='Create new proposal'
            primaryAction={{ content: 'Continue', onAction: this.togglePreview }}
          >
            {this.renderContent()}
            <Layout.Section />
            <PageActions
              primaryAction={{ content: 'Continue', onAction: this.togglePreview }}
              secondaryActions={[{ content: 'Discard', onAction: this.back }]}
            />
          </Page>
        </PageLayout>
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  plans: _.get(state, 'references.plans', {}),
  account: state.account,
  lineItems: extractLineItemsFromState(state)
})

export default connect(mapStateToProps)(ProposalCreate)
