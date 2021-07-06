import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Modal,
  Stack,
  Form,
  FormLayout,
  ResourceList,
  TextStyle,
  TextField,
  Button
} from '@shopify/polaris'
import moment from 'moment'
import _ from 'lodash'
import styled from 'styled-components'
import generate from 'firebase-auto-ids'

import { getBalanceDue, getNonFinancedAmount, getProgressPaymentsSum } from 'shared/utils/proposal'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import MoneyTextField from 'components/common/MoneyTextField'

const StackWrapper = styled.div`
  .Polaris-Stack > .Polaris-Stack__Item {
    flex: 1;
  }

  .Polaris-Stack > .Polaris-Stack__Item :first-child {
    flex: 4;
  }
`

class ProgressPaymentsModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      progressPayments: _.get(props, 'proposal.progressPayments', {}),
      selectedItems: [],
      newItemName: '',
      newItemCost: '',
      newItemDate: null
    }
  }

  handleSelectionLineItemsChange = (selectedItems) => {
    this.setState({ selectedItems: selectedItems })
  }

  handleChangeNewItemCost = (v) => this.setState({ newItemCost: v })
  handleChangeNewItemName = (v) => this.setState({ newItemName: v })
  handleChangeNewItemDate = (v) => this.setState({ newItemDate: v })

  deleteLineItems = () => {
    const { selectedItems, progressPayments } = this.state
    const progressPaymentsCopy = { ...progressPayments }
    for (const itemId of selectedItems) {
      delete progressPaymentsCopy[itemId]
    }
    this.setState({
      selectedItems: [],
      progressPayments: progressPaymentsCopy
    })
  }

  addProgressPaymentsItem = () => {
    // console.log('addprogressPaymentsItem')
    const { newItemName, newItemCost, newItemDate, progressPayments } = this.state
    const { proposal } = this.props
    const newItemNameIsValid = newItemName !== ''

    let newItemCostIsValid = false
    let newItemCostValue = _.round(newItemCost, 2)
    newItemCostValue = _.isNaN(newItemCostValue) ? 0 : newItemCostValue
    const nonFinancedAmount = getNonFinancedAmount(proposal)
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
      this.setState({
        newItemName: '',
        newItemCost: '',
        newItemDate: null,
        progressPayments: newProgressPayments
      })
    }
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
            label='Estimated date'
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

  renderContent = () => {
    const { proposal } = this.props
    const { selectedItems, progressPayments } = this.state
    // const plan = _.get(proposal, 'plan')
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    if (!_.isNil(amountToFinance) && amountToFinance < balanceDue) {
      const resourceName = {
        singular: 'item',
        plural: 'items'
      }
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
        <React.Fragment>
          <Card.Section subdued>
            <p>The schedule of progress payments describes each phase of work, including the type and amount of work or services scheduled to be supplied in each phase along with the amount of each proposed progress payment.</p>
          </Card.Section>
          <Card.Section>
            <ResourceList
              resourceName={resourceName}
              items={sortedItems}
              renderItem={this.renderLineItem}
              promotedBulkActions={[{ content: 'Delete', onAction: this.deleteLineItems }]}
              selectedItems={selectedItems}
              onSelectionChange={this.handleSelectionLineItemsChange}
            />
          </Card.Section>

          <Card.Section>
            <Form onSubmit={this.addProgressPaymentsItem}>
              { defaultItemCost > 0 ? this.renderNewItemForm() : null }
            </Form>
          </Card.Section>
        </React.Fragment>
      )
    } else {
      return null
    }
  }

  save = () => {
    const { progressPayments } = this.state
    const { handleChange, onClose } = this.props
    handleChange('progressPayments')(progressPayments)
    onClose()
  }

  render = () => {
    const { modalProps, visible, onClose } = this.props
    return (
      <Modal
        secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
        primaryAction={[{ content: 'Save', onAction: this.save }]}
        title='Create schedule of progress payments'
        open={visible}
        onClose={onClose}
        {...modalProps}
      >
        {this.renderContent()}
      </Modal>
    )
  }
}

ProgressPaymentsModal.defaultProps = {
  modalProps: {},
  cardProps: {}
}

ProgressPaymentsModal.propTypes = {
  proposal: PropTypes.object,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  handleChange: PropTypes.func
}

export default ProgressPaymentsModal
