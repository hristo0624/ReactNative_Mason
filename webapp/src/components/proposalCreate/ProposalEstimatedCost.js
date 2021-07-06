import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Layout, Card, Caption, FormLayout, Select } from '@shopify/polaris'

import amountType from 'shared/constants/amountType'
import MoneyTextField from 'components/common/MoneyTextField'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import { getBalanceDue } from 'shared/utils/proposal'

const amountTypeOptions = [
  { label: '%', value: amountType.PERCENTAGE },
  { label: '$', value: amountType.FLAT_AMOUNT }
]

class ProposalEstimatedCost extends Component {
  renderPercFixedSelect = (value, onChange) => {
    return (
      <Select
        label='Amount type'
        labelHidden
        options={amountTypeOptions}
        value={value}
        onChange={onChange}
      />
    )
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

  render () {
    const { proposal, isCalculated, handleChange, errors, resetError } = this.props
    const currentDepositAmountType = _.get(proposal, 'deposit.type', amountType.FLAT_AMOUNT)
    const depositValue = _.get(proposal, 'deposit.value', '')
    const depositPerc = _.get(proposal, 'deposit.perc', '')
    const depositAmount = currentDepositAmountType === amountType.PERCENTAGE ? depositPerc : depositValue
    const connectedRight = this.renderPercFixedSelect(currentDepositAmountType, this.onDepositAmountTypeChange)
    const depositHelpText = <Caption>If a downpayment will be charged, the downpayment may not exceed one thousand dollars ($1,000) or 10 percent of the contract amount, whichever is less. <a href='http://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7159.5.' target='_blank'>(Business and Professions Code section 7159.5)</a></Caption>
    return (
      <Layout.AnnotatedSection
        title='Estimated project cost'
        sectioned
      >
        <Card sectioned>
          <FormLayout>
            <MoneyTextField
              label='Project cost'
              onChange={handleChange('projectCost')}
              value={_.toString(_.get(proposal, 'projectCost', '0'))}
              disabled={isCalculated}
              error={_.get(errors, 'projectCost')}
              onFocus={resetError('projectCost')}
            />
            <MoneyTextField
              label={`Deposit ${moneyWithSymbolAbbr(depositValue || 0, '$')} (${depositPerc || 0}%)`}
              prefix={currentDepositAmountType === amountType.PERCENTAGE ? '%' : '$'}
              onChange={this.handleDepositAmountChange}
              value={_.toString(depositAmount)}
              connectedRight={connectedRight}
              helpText={depositHelpText}
            />
            <MoneyTextField
              label='Balance due'
              value={_.toString(getBalanceDue(proposal))}
              disabled
            />
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    )
  }
}

ProposalEstimatedCost.defaultProps = {
  resetError: () => null
}

ProposalEstimatedCost.propTypes = {
  proposal: PropTypes.object,
  handleChange: PropTypes.func,
  isCalculated: PropTypes.bool,
  errors: PropTypes.object,
  resetError: PropTypes.func
}

export default ProposalEstimatedCost
