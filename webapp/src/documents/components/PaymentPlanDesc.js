import _ from 'lodash'
import { moneyWithSymbolAbbr } from 'shared/utils/money'

const PaymentPlanDesc = ({ amountToFinance, deposit, monthAmount, sameAsCash }) => {
  let paymentPlanDesc = ''
  if (sameAsCash) {
    if (amountToFinance > 0) {
      paymentPlanDesc = `We propose to make two payments: deposit of ${moneyWithSymbolAbbr(deposit, '$')} and ${moneyWithSymbolAbbr(amountToFinance, '$')} in ${monthAmount} months.`
    } else {
      paymentPlanDesc = `We propose to make one payemnt of ${moneyWithSymbolAbbr(amountToFinance, '$')} in ${monthAmount} months.`
    }
  } else {
    if (amountToFinance > 0) {
      paymentPlanDesc = `We propose to make ${monthAmount + 1} payments: deposit of ${moneyWithSymbolAbbr(deposit, '$')} and ${monthAmount} payments of ${moneyWithSymbolAbbr(_.round(amountToFinance / monthAmount, 2), '$')}.`
    } else {
      paymentPlanDesc = `We propose to make ${monthAmount} payments of ${moneyWithSymbolAbbr(_.round(amountToFinance / monthAmount, 2), '$')}.`
    }
  }
  return paymentPlanDesc
}

export default PaymentPlanDesc
