import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Layout, Card, FormLayout, ChoiceList, Checkbox, ResourceList, Stack, TextStyle, TextField, Form, Button } from '@shopify/polaris'
import moment from 'moment'
import generate from 'firebase-auto-ids'
import styled from 'styled-components'

import MoneyTextField from 'components/common/MoneyTextField'
import { getBalanceDue, getProgressPaymentsSum, getNonFinancedAmount, getAmountToFinance } from 'shared/utils/proposal'
import { moneyWithSymbolAbbr } from 'shared/utils/money'

const StackWrapper = styled.div`
  .Polaris-Stack > .Polaris-Stack__Item {
    flex: 1;
  }

  .Polaris-Stack > .Polaris-Stack__Item :first-child {
    flex: 4;
  }
`

class ProposalPaymentPlans extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedLineItems: [],
      newItemName: '',
      newItemCost: '',
      newItemDate: null
    }
  }

  handleSelectionLineItemsChange = (selectedItems) => {
    this.setState({ selectedLineItems: selectedItems })
  }

  handleSelectPlan = (v) => {
    const planId = v[0]
    const { plans, handleChange } = this.props
    const plan = _.get(plans, planId)
    handleChange('plan')(plan)
  }

  renderSameAsCash = () => {
    const { proposal, plans, sameAsCashFee, handleChange } = this.props
    const planId = _.get(proposal, 'plan.id')
    if (planId) {
      const plan = _.get(plans, planId)
      const sameAsCashChecked = _.get(proposal, 'sameAsCash')
      if (plan.amount > 0) {
        return (
          <Card.Section
            title={'Same as cash'}
          >
            <FormLayout>
              <p>Instead of monthly payments, offer 1 lump sum payment at the end of term</p>
              <Checkbox
                checked={sameAsCashChecked}
                label='Same as cash'
                onChange={handleChange('sameAsCash')}
                helpText={`${sameAsCashFee}% additional fee`}
              />
            </FormLayout>
          </Card.Section>
        )
      }
    }
  }

  changeAmountToFinanceMode = () => {
    // console.log('changeAmountToFinanceMode')
    const { proposal, handleChange } = this.props
    const amountToFinanceRow = _.get(proposal, 'amountToFinance')
    if (_.isNil(amountToFinanceRow)) {
      handleChange('amountToFinance')(getBalanceDue(proposal))
    } else {
      handleChange('amountToFinance')(null)
    }
  }

  handleAmountOfFinanceChange = (v) => {
    const { proposal, handleChange } = this.props
    if (v !== '') {
      let res = '0'
      const balanceDue = getBalanceDue(proposal)
      if (v !== '') {
        const amount = _.round(v, 2)
        if (amount > balanceDue) {
          res = balanceDue.toString()
        } else if (amount < 0) {
          res = '0'
        } else {
          res = amount.toString()
        }
      } else {
        res = '0'
      }
      // console.log('handleAmountOfFinanceChange v', v, 'res', res)
      handleChange('amountToFinance')(res)
    } else {
      handleChange('amountToFinance')(v)
    }
  }

  amountToFinanceOnBlur = () => {
    const { proposal, handleChange } = this.props
    const amountToFinance = _.get(proposal, 'amountToFinance')
    if (amountToFinance === '') handleChange('amountToFinance')(0)
  }

  deleteLineItems = () => {
    const { selectedLineItems } = this.state
    const { handleChange, proposal } = this.props
    const curProgressPayments = _.get(proposal, 'progressPayments', {})
    const progressPaymentsCopy = { ...curProgressPayments }
    for (const itemId of selectedLineItems) {
      delete progressPaymentsCopy[itemId]
    }
    // console.log('deleteLineItems, progressPaymentsCopy', progressPaymentsCopy)
    this.setState({
      selectedLineItems: []
    })
    handleChange('progressPayments')(progressPaymentsCopy)
  }

  renderLineItem = (item) => {
    // const shortcutActions = [{ icon: 'delete', onAction: this.removeLineItem(item.id) }]
    const cost = _.get(item, 'cost', 0)
    const date = _.get(item, 'date')
    const strDate = date ? moment(date).format('MM/DD/YYYY') : ' - '
    return (
      <ResourceList.Item
        key={item.id}
        id={item.id}
        // shortcutActions={shortcutActions}
        // media={<Icon size='big' source='products' />}
      >
        <StackWrapper>
          <Stack distribution='equalSpacing'>
            <TextStyle variation='strong'>{item.name}</TextStyle>
            <TextStyle>{strDate}</TextStyle>
            <TextStyle variation='strong'>{moneyWithSymbolAbbr(cost)}</TextStyle>
          </Stack>
        </StackWrapper>
      </ResourceList.Item>
    )
  }

  handleChangeNewItemCost = (v) => this.setState({ newItemCost: v })
  handleChangeNewItemName = (v) => this.setState({ newItemName: v })
  handleChangeNewItemDate = (v) => this.setState({ newItemDate: v })

  addProgressPaymentsItem = () => {
    // console.log('addprogressPaymentsItem')
    const { newItemName, newItemCost, newItemDate } = this.state
    const { proposal, handleChange } = this.props
    const newItemNameIsValid = newItemName !== ''

    let newItemCostIsValid = false
    let newItemCostValue = _.round(newItemCost, 2)
    newItemCostValue = _.isNaN(newItemCostValue) ? 0 : newItemCostValue
    const nonFinancedAmount = getNonFinancedAmount(proposal)
    const progressPayments = _.get(proposal, 'progressPayments', {})
    const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
    const maxValue = nonFinancedAmount - progressPaymentsSum
    newItemCostValue = newItemCostValue > maxValue ? maxValue : newItemCostValue
    newItemCostIsValid = newItemCostValue > 0

    let newItemDateIsValid = moment().isBefore(moment(newItemDate))
    if (newItemNameIsValid && newItemCostIsValid && newItemDateIsValid) {
      const item = {
        id: generate(_.now()),
        name: newItemName,
        cost: newItemCostValue,
        date: newItemDate
      }
      const newProgressPayments = {
        ...progressPayments,
        [item.id]: item
      }
      handleChange('progressPayments')(newProgressPayments)
      this.setState({
        newItemName: '',
        newItemCost: '',
        newItemDate: null
      })
    }
  }

  renderNewItemForm = () => {
    const { newItemName, newItemCost, newItemDate } = this.state
    return (
      <FormLayout>
        <FormLayout.Group>
          <MoneyTextField
            value={newItemCost}
            onChange={this.handleChangeNewItemCost}
            label='Amount of progress payment'
          />
          <TextField
            value={newItemDate}
            onChange={this.handleChangeNewItemDate}
            label='Estimated completion date'
            type='date'
          />
        </FormLayout.Group>
        <TextField
          value={newItemName}
          onChange={this.handleChangeNewItemName}
          label='Work or services to be performed or Materials to be supplied'
        />
        <Button submit>Add</Button>
      </FormLayout>
    )
  }

  renderSceduleOfProgressPayments = () => {
    const { proposal } = this.props
    const { selectedLineItems } = this.state
    // const plan = _.get(proposal, 'plan')
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    if (!_.isNil(amountToFinance) && amountToFinance < balanceDue) {
      const progressPayments = _.get(proposal, 'progressPayments', {})
      const resourceName = {
        singular: 'item',
        plural: 'items'
      }
      const items = _.values(progressPayments)
      const nonFinancedAmount = getNonFinancedAmount(proposal)
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      // console.log('progressPayments', progressPayments, 'progressPaymentsSum', progressPaymentsSum)
      const defaultItemCost = nonFinancedAmount - progressPaymentsSum
      if (defaultItemCost > 0) {
        // need add default row
        items.push({
          id: 'default',
          cost: defaultItemCost,
          date: null,
          name: 'Completion of all work'
        })
      }
      return (
        <Card.Section
          title='Schedule of progress payments'
        >
          <Form onSubmit={this.addProgressPaymentsItem}>
            <Stack vertical>
              <FormLayout>
                <p>The schedule of progress payments describes each phase of work, including the type and amount of work or services scheduled to be supplied in each phase along with the amount of each proposed progress payment.</p>
                <ResourceList
                  resourceName={resourceName}
                  items={items}
                  renderItem={this.renderLineItem}
                  promotedBulkActions={[{ content: 'Delete', onAction: this.deleteLineItems }]}
                  selectedItems={selectedLineItems}
                  onSelectionChange={this.handleSelectionLineItemsChange}
                />
              </FormLayout>
              { defaultItemCost > 0 ? this.renderNewItemForm() : null }
            </Stack>
          </Form>
        </Card.Section>
      )
    } else {
      return null
    }
  }

  render () {
    const { proposal, plansOptions } = this.props
    const planId = _.get(proposal, 'plan.id')
    const planAmount = _.get(proposal, 'plan.amount', 0)
    // const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    // console.log('amount to finance row', amountToFinance)
    // console.log('amount to finance value', _.toString(_.isNil(amountToFinance) ? balanceDue : amountToFinance))
    // console.log('real amoun to finance', getAmountToFinance(proposal))
    return (
      <Layout.AnnotatedSection
        title='Choose a payment plan'
        sectioned
      >
        <Card
          title='Payment plan term'
        >
          <Card.Section>
            <FormLayout>
              <MoneyTextField
                label='Amount to finance'
                onChange={this.handleAmountOfFinanceChange}
                value={_.toString(getAmountToFinance(proposal))}
                labelAction={{
                  content: _.isNil(amountToFinance) ? 'Edit' : 'Auto',
                  onAction: this.changeAmountToFinanceMode
                }}
                disabled={_.isNil(amountToFinance)}
                onBlur={this.amountToFinanceOnBlur}
                helpText={_.isNil(amountToFinance) && planAmount > 0 ? 'Defaults to balance of payments due' : null}
              />
            </FormLayout>
          </Card.Section>
          {this.renderSceduleOfProgressPayments()}
          <Card.Section
            title='Payment plan'
          >
            <FormLayout>
              <p>Select payment plan for financed amount of the contract</p>
              <ChoiceList
                choices={plansOptions}
                onChange={this.handleSelectPlan}
                selected={[planId]}
              />
            </FormLayout>
          </Card.Section>
          {this.renderSameAsCash()}
        </Card>
      </Layout.AnnotatedSection>
    )
  }
}

ProposalPaymentPlans.propTypes = {
  proposal: PropTypes.object,
  handleChange: PropTypes.func,
  plansOptions: PropTypes.array
}

const mapStateToProps = (state) => ({
  plans: _.get(state, 'references.plans', {}),
  sameAsCashFee: _.get(state, 'references.sameAsCashFee', '...')
})

export default connect(mapStateToProps)(ProposalPaymentPlans)
