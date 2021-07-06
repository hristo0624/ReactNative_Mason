import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
  Layout,
  Card,
  Stack,
  Heading,
  Icon,
  DisplayText,
  TextStyle,
  Select,
  ButtonGroup,
  Button,
  ResourceList
} from '@shopify/polaris'
import styled from 'styled-components'
import moment from 'moment'

import amountType from 'shared/constants/amountType'
import MoneyTextField from 'components/common/MoneyTextField'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import { getBalanceDue, getAmountToFinance, getNonFinancedAmount, getProgressPaymentsSum } from 'shared/utils/proposal'
import checklistIcon from 'assets/icons/checklist-alternative.svg'
import PercOrFixedSelect from 'components/common/PercOrFixedSelect'
import ProgressPaymentsModal from 'components/proposalCreate/proposalFinancing/ProgressPaymentsModal'

const StyledStack = styled.div`
  > .Polaris-Stack > .Polaris-Stack__Item :first-child {
    flex: 1
  }

  > .Polaris-Stack > .Polaris-Stack__Item :nth-child(2) {
    flex: 1.5
  }
`
const ProgressPaymentsStackWrapper = styled.div`
  .Polaris-Stack > .Polaris-Stack__Item {
    flex: 1;
  }

  .Polaris-Stack > .Polaris-Stack__Item :first-child {
    flex: 4;
  }
`

class ProposalFinancing extends Component {
  constructor (props) {
    super(props)
    this.state = {
      progressPaymentsModalVisible: false,
      amountToFinanceFocused: false
    }
  }
  onDepositAmountTypeChange = (v) => {
    const { handleChange } = this.props
    const deposit = {
      value: 0,
      perc: 0,
      type: v
    }
    handleChange('deposit')(deposit)
  }

  handleDepositAmountChange = (v) => {
    const { proposal, handleChange } = this.props
    const dType = _.get(proposal, 'deposit.type', amountType.FLAT_AMOUNT)
    if (v === '') {
      const deposit = {
        value: null,
        type: dType,
        perc: null
      }
      handleChange('deposit')(deposit)
    } else {
      const projectCost = _.get(proposal, 'projectCost', 0)
      if (dType === amountType.FLAT_AMOUNT) {
        let dValue = v
        if (dValue < 0) dValue = 0
        const maxPercValue = projectCost * 0.1
        if (dValue > maxPercValue) dValue = maxPercValue
        if (dValue > 1000) dValue = 1000
        const deposit = {
          value: _.round(dValue, 2),
          type: dType,
          perc: projectCost > 0 ? _.round(dValue / projectCost * 100, 2) : null
        }
        handleChange('deposit')(deposit)
      } else {
        const projectCost = _.get(proposal, 'projectCost', 0)
        let dValue = projectCost * v / 100
        if (dValue < 0) dValue = 0
        const maxPercValue = projectCost * 0.1
        if (dValue > maxPercValue) dValue = maxPercValue
        if (dValue > 1000) dValue = 1000
        const deposit = {
          value: _.round(dValue, 2),
          type: dType,
          perc: projectCost > 0 ? _.round(dValue / projectCost * 100, 2) : null
        }
        handleChange('deposit')(deposit)
      }
    }
  }

  renderDepositInput = () => {
    const { proposal } = this.props
    const currentDepositAmountType = _.get(proposal, 'deposit.type', amountType.FLAT_AMOUNT)
    const depositValue = _.get(proposal, 'deposit.value', '')
    const depositPerc = _.get(proposal, 'deposit.perc', '')
    const depositAmount = currentDepositAmountType === amountType.PERCENTAGE ? depositPerc : depositValue
    return (
      <MoneyTextField
        // label={`Deposit ${moneyWithSymbolAbbr(depositValue || 0, '$')} (${depositPerc || 0}%)`}
        label='Down payment'
        prefix={currentDepositAmountType === amountType.PERCENTAGE ? '%' : '$'}
        onChange={this.handleDepositAmountChange}
        value={_.toString(depositAmount)}
        connectedRight={(
          <PercOrFixedSelect
            value={currentDepositAmountType}
            onChange={this.onDepositAmountTypeChange}
          />
        )}
      />
    )
  }

  handleAmountOfFinanceChange = (v) => {
    const { proposal, handleChange } = this.props
    if (v !== '') {
      let res = '0'
      const balanceDue = getBalanceDue(proposal)
      let amount = _.round(v, 2)
      if (_.isNaN(amount)) amount = 0
      if (amount > balanceDue) {
        res = balanceDue.toString()
      } else if (amount < 0) {
        res = '0'
      } else {
        res = amount.toString()
      }
      // console.log('handleAmountOfFinanceChange v', v, 'res', res)
      handleChange('amountToFinance')(res)
    } else {
      handleChange('amountToFinance')(v)
    }
  }

  renderContractPriceBlock = () => {
    const { proposal } = this.props
    const projectCost = _.get(proposal, 'projectCost', 0)
    return (
      <Card.Section>
        <StyledStack>
          <Stack>
            <Stack vertical spacing='extraTight'>
              <Stack wrap={false} alignment='center' distribution='center'>
                <Icon source={checklistIcon} color='black' />
                <Heading>Total Contract price</Heading>
              </Stack>
              <Stack distribution='center'>
                <DisplayText>
                  <TextStyle variation='strong'>
                    {moneyWithSymbolAbbr(projectCost)}
                  </TextStyle>
                </DisplayText>
              </Stack>
            </Stack>
            {this.renderDepositInput()}
          </Stack>
        </StyledStack>
      </Card.Section>
    )
  }

  renderAmountToFinanceValue = () => {
    const { proposal } = this.props
    const amountToFinance = getAmountToFinance(proposal)
    const amountToFinanceIsSet = _.has(proposal, 'amountToFinance')
    if (amountToFinanceIsSet) {
      return (
        <TextStyle variation='strong'>
          {moneyWithSymbolAbbr(amountToFinance)}
        </TextStyle>
      )
    } else {
      return (
        <TextStyle variation='subdued'>
          $
        </TextStyle>
      )
    }
  }

  enableEtireContractMode = () => {
    const { handleChange, proposal } = this.props
    const balanceDue = getBalanceDue(proposal)
    handleChange('amountToFinance')(balanceDue)
  }

  enableCustomMode = () => {
    const { handleChange } = this.props
    handleChange('amountToFinance')('')
    this.setState({ amountToFinanceFocused: true })
  }

  handleChangePlan = (planId) => {
    const { plans, handleChange } = this.props
    const plan = _.get(plans, planId)
    handleChange('plan')(plan)
  }

  changeAmountToFinanceFocus = () => this.setState({ amountToFinanceFocused: true })

  amountToFinanceOnBlur = () => {
    const { proposal, handleChange } = this.props
    const amountToFinance = _.get(proposal, 'amountToFinance')
    if (amountToFinance === '') handleChange('amountToFinance')(0)
    this.setState({ amountToFinanceFocused: false })
  }

  renderPaymentPlanSettings = () => {
    const { proposal, plans, handleChange, sameAsCashFee } = this.props
    const { amountToFinanceFocused } = this.state
    const amountToFinance = getAmountToFinance(proposal)
    // const amountToFinanceRaw = _.get(proposal, 'amountToFinance')
    const amountToFinanceIsSet = _.has(proposal, 'amountToFinance')
    console.log('amountToFinance is set', amountToFinanceIsSet)
    const plan = _.get(proposal, 'plan')
    const paymentPlanOptions = _.map(plans, (p, planId) => {
      const ppm = _.round(amountToFinance / p.amount, 2)
      return {
        value: planId,
        label: `${p.amount} payments of ${moneyWithSymbolAbbr(ppm)}`,
        amount: p.amount
      }
    })
    const sortedPaymentPlanOptions = _.sortBy(paymentPlanOptions, 'amount')
    const sameAsCashChecked = _.get(proposal, 'sameAsCash')
    if (amountToFinanceIsSet) {
      return (
        <Stack vertical>
          <MoneyTextField
            label='Amount to finance'
            onChange={this.handleAmountOfFinanceChange}
            value={_.toString(getAmountToFinance(proposal))}
            // labelAction={{
            //   content: _.isNil(amountToFinance) ? 'Edit' : 'Auto',
            //   onAction: this.changeAmountToFinanceMode
            // }}
            focused={amountToFinanceFocused}
            onFocus={this.changeAmountToFinanceFocus}
            // disabled={_.isNil(amountToFinanceRaw)}
            onBlur={this.amountToFinanceOnBlur}
          />
          { amountToFinance > 0
            ? <Select
              options={sortedPaymentPlanOptions}
              value={_.get(plan, 'id')}
              label='Type of payment plan'
              helpText={`${_.get(plan, 'fee')}% contractor fee`}
              onChange={this.handleChangePlan}
            />
            : null
          }
        </Stack>
      )
    } else {
      return (
        <Stack vertical spacing='extraTight'>
          <TextStyle variation='subdued'>
            Amount to finance
          </TextStyle>
          <ButtonGroup>
            <Button primary onClick={this.enableEtireContractMode}>Entire contract</Button>
            <Button onClick={this.enableCustomMode}>Custom</Button>
          </ButtonGroup>
        </Stack>
      )
    }
  }

  renderPaymentPlanBlock = () => {
    return (
      <Card.Section>
        <StyledStack>
          <Stack>
            <Stack vertical spacing='extraTight'>
              <Stack wrap={false} alignment='center' distribution='center'>
                <TextStyle variation='subdued'>
                  Whithin Payment plan
                </TextStyle>
              </Stack>
              <Stack distribution='center'>
                <DisplayText>
                  {this.renderAmountToFinanceValue()}
                </DisplayText>
              </Stack>
            </Stack>
            {this.renderPaymentPlanSettings()}
          </Stack>
        </StyledStack>
      </Card.Section>
    )
  }

  renderAmountOfNonFinanced = () => {
    const { proposal } = this.props
    const amountToFinance = getAmountToFinance(proposal)
    const amountToFinanceIsSet = _.has(proposal, 'amountToFinance')
    const balanceDue = getBalanceDue(proposal)
    const nonFinanced = balanceDue - amountToFinance
    if (amountToFinanceIsSet) {
      return (
        <TextStyle variation='strong'>
          {moneyWithSymbolAbbr(nonFinanced)}
        </TextStyle>
      )
    } else {
      return (
        <TextStyle variation='subdued'>
          $
        </TextStyle>
      )
    }
  }

  toggleProgressPaymentsModal = () => this.setState({ progressPaymentsModalVisible: !this.state.progressPaymentsModalVisible })

  renderProgressPaymentButtons = () => {
    const { proposal } = this.props
    const progressPayments = _.get(proposal, 'progressPayments', {})
    const amountToFinanceIsSet = _.has(proposal, 'amountToFinance')
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = getAmountToFinance(proposal)
    const nonFinanced = balanceDue - amountToFinance
    console.log('nonFinanced part', nonFinanced)
    if (!amountToFinanceIsSet || _.isEmpty(progressPayments) || nonFinanced === 0) {
      return (
        <Button
          primary
          disabled={!amountToFinanceIsSet || nonFinanced === 0}
          onClick={this.toggleProgressPaymentsModal}
        >
          Create schedule of payments
        </Button>
      )
    } else {
      return (
        <Button onClick={this.toggleProgressPaymentsModal}>
          Edit schedule of payments
        </Button>
      )
    }
  }

  renderProgressPaymentsBlock = () => {
    return (
      <Card.Section>
        <StyledStack>
          <Stack alignment='center'>
            <Stack vertical spacing='extraTight' >
              <Stack wrap={false} alignment='center' distribution='center'>
                <TextStyle variation='subdued'>
                  Outside of Payment plan
                </TextStyle>
              </Stack>
              <Stack distribution='center'>
                <DisplayText>
                  {this.renderAmountOfNonFinanced()}
                </DisplayText>
              </Stack>
            </Stack>
            {this.renderProgressPaymentButtons()}
          </Stack>
        </StyledStack>
      </Card.Section>
    )
  }

  renderProgressPaymentsModal = () => {
    const { proposal, handleChange } = this.props
    const { progressPaymentsModalVisible } = this.state
    return (
      <ProgressPaymentsModal
        proposal={proposal}
        handleChange={handleChange}
        visible={progressPaymentsModalVisible}
        onClose={this.toggleProgressPaymentsModal}
      />
    )
  }

  renderProgressPaymentItem = (item) => {
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
        <ProgressPaymentsStackWrapper>
          <Stack distribution='equalSpacing'>
            <TextStyle variation='strong'>{item.name}</TextStyle>
            <TextStyle>{strDate}</TextStyle>
            <TextStyle variation='strong'>{moneyWithSymbolAbbr(cost)}</TextStyle>
          </Stack>
        </ProgressPaymentsStackWrapper>
      </ResourceList.Item>
    )
  }

  renderProgressPaymentsSchedule = () => {
    const { proposal } = this.props
    const progressPayments = _.get(proposal, 'progressPayments', {})
    if (!_.isEmpty(progressPayments)) {
      const items = _.values(progressPayments)
      const sortedItems = _.sortBy(items, pp => pp.date ? moment(pp.date).unix() : Number.MAX_VALUE)
      const nonFinancedAmount = getNonFinancedAmount(proposal)
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      // console.log('progressPayments', progressPayments, 'progressPaymentsSum', progressPaymentsSum)
      const defaultItemCost = nonFinancedAmount - progressPaymentsSum
      if (defaultItemCost > 0) {
        // need add default row
        sortedItems.push({
          id: 'default',
          cost: defaultItemCost,
          date: null,
          name: 'Completion of all work'
        })
      }
      return (
        <Card.Section
          title='Schedule of progress payments'
          subdued
          actions={[{ content: 'Edit', onAction: this.toggleProgressPaymentsModal }]}
        >
          <ResourceList
            items={sortedItems}
            renderItem={this.renderProgressPaymentItem}
          />
        </Card.Section>
      )
    }
  }

  render () {
    return (
      <Layout.AnnotatedSection
        title='Payment plan'
        sectioned
      >
        <Card>
          {this.renderContractPriceBlock()}
          {this.renderPaymentPlanBlock()}
          {this.renderProgressPaymentsBlock()}
          {this.renderProgressPaymentsSchedule()}
        </Card>
        {this.renderProgressPaymentsModal()}
      </Layout.AnnotatedSection>
    )
  }
}

ProposalFinancing.defaultProps = {
  resetError: () => null
}

ProposalFinancing.propTypes = {
  proposal: PropTypes.object,
  handleChange: PropTypes.func
}

const mapStateToProps = state => ({
  plans: _.get(state, 'references.plans', {}),
  sameAsCashFee: _.get(state, 'references.sameAsCashFee', '...')
})

export default connect(mapStateToProps)(ProposalFinancing)
