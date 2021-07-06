import _ from 'lodash'
import amountType from 'shared/constants/amountType'

export function getBalanceDue (proposal) {
  let balanceDue = _.get(proposal, 'projectCost', 0) - _.get(proposal, 'deposit.value', 0)
  if (balanceDue < 0) balanceDue = 0
  return _.round(balanceDue, 2)
}

export function getAmountToFinance (proposal) {
  // console.log('getAmountToFinance', proposal)
  const amountToFinance = _.get(proposal, 'amountToFinance')
  let delta = getBalanceDue(proposal)
  // let planAmount = _.get(proposal, 'plan.amount', 0)
  // if (_.isNil(amountToFinance) && planAmount === 0) {
  //   delta = 0
  // } else
  if (!_.isNil(amountToFinance)) {
    delta = amountToFinance
  }
  return delta
}

export function isProjectCostCalculated (lineItems) {
  let isCalculated = false
  if (lineItems) {
    for (const id in lineItems) {
      const l = lineItems[id]
      const cost = _.get(l, 'cost', 0)
      if (cost > 0) {
        isCalculated = true
      }
    }
  }
  return isCalculated
}

export function calculateProjectCost (lineItems) {
  return _.sumBy(_.values(lineItems), l => {
    const qty = _.get(l, 'quantity', 1)
    const cost = _.get(l, 'cost', 0)
    return qty * cost
  })
}

export function getUpdatedDepositValue (projectCost, curDeposit) {
  // console.log('update deposit value', projectCost, curDeposit)
  const dType = _.get(curDeposit, 'type', amountType.FLAT_AMOUNT)
  const dValue = _.get(curDeposit, 'value', 0)
  const dPerc = _.get(curDeposit, 'perc', 0)
  if (dType === amountType.FLAT_AMOUNT) {
    return ({
      value: dValue,
      type: dType,
      perc: projectCost > 0 ? _.round(dValue / projectCost * 100, 2) : null
    })
  } else {
    let newValue = projectCost * dPerc / 100
    if (newValue < 0) newValue = 0
    const maxPercValue = projectCost * 0.1
    if (newValue > maxPercValue) newValue = maxPercValue
    if (newValue > 1000) newValue = 1000
    return ({
      value: _.round(newValue, 2),
      type: dType,
      perc: projectCost > 0 ? _.round(newValue / projectCost * 100, 2) : null
    })
  }
}

export function getProgressPaymentsSum (progressPayments) {
  return _.sumBy(_.values(progressPayments), pp => pp.cost)
}

export function getNonFinancedAmount (proposal) {
  const balanceDue = getBalanceDue(proposal)
  const amountToFinance = getAmountToFinance(proposal)
  return balanceDue - amountToFinance
}


