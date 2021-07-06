import _ from 'lodash'
import { PERCENTAGE, FLAT_AMOUNT } from 'constants/discountType'
import { INCLUSIVE } from 'constants/taxTypes'

function formatMoney (amount, decimalCount = 2, decimal = '.', thousands = ' ') {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? '-' : ''

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
    let j = (i.length > 3) ? i.length % 3 : 0
    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
  } catch (e) {
    console.log(e)
  }
};

export function moneyWithSymbolAbbr (value, symbol, abbr) {
  return `${symbol}${formatMoney(value)} ${abbr}`
}

export function moneyWithSymbol (value, symbol = '$') {
  return `${symbol}${formatMoney(value)}`
}

export function getDiscountValue (fullPrice, discountType, discountAmount) {
  let discountValue = 0
  if (discountType === PERCENTAGE) discountValue = _.round(fullPrice / 100 * discountAmount, 2)
  if (discountType === FLAT_AMOUNT) discountValue = _.round(discountAmount, 2)
  discountValue = _.isNaN(discountValue) ? 0 : discountValue
  return discountValue
}

export function getDepositValue (fullPrice, type, amount) {
  let value = 0
  if (type === PERCENTAGE) value = _.round(fullPrice * amount / 100, 2)
  if (type === FLAT_AMOUNT) value = _.round(amount, 2)
  value = _.isNaN(value) ? 0 : value
  return value
}

function isInclusive (t) {
  const accumulativeOf = _.get(t, 'accumulativeOf', [])
  return t.type === INCLUSIVE && accumulativeOf.length === 0
}

export function calcItemPrice (rate, quantity, discountType, discountAmount, taxRates, taxes, docDiscountValue = 0) {
  const fullPrice = _.round(rate * quantity, 2)
  const discountValue = getDiscountValue(fullPrice, discountType, discountAmount)
  console.log('calcItemPrice: rate', rate, 'quantity', quantity, 'fullPrice', fullPrice, 'docDiscountValue', docDiscountValue)
  const subtotal = _.round(fullPrice - discountValue, 2)
  const subtotalWithDocDiscount = _.round(subtotal - docDiscountValue, 2)
  // console.log('discountType', discountType, 'discountAmount', discountAmount, 'discountValue', discountValue)
  // console.log('subtotal', subtotal)
  // console.log('subtotalWithDocDiscount', subtotalWithDocDiscount)
  // console.log('taxRates', taxRates)
  // console.log('taxes', taxes)
  const taxArray = _.values(taxes)
  taxArray.sort((a, b) => {
    const accA = _.get(a, 'accumulativeOf', [])
    const accB = _.get(b, 'accumulativeOf', [])
    if (accA.indexOf(b.id) >= 0) {
      // console.log('a', a.id, accA, ' --- b', b.id, accB, '= 1')
      return 1
    } else if (accB.indexOf(a.id) >= 0) {
      // console.log('a', a.id, accA, ' --- b', b.id, accB, '= -1')
      return -1
    } else {
      // console.log('a', a.id, accA, ' --- b', b.id, accB, '= 0')
      return 0
    }
  })
  // console.log('sortedTaxes', taxArray)
  const appliedTaxes = {}
  let total = subtotalWithDocDiscount
  // if (total !== _.round(total, 2)) {
  //   console.warn('total', total, 'rounded total', _.round(total, 2))
  //   console.warn('errr subtotal', subtotal, 'docDiscountValue', docDiscountValue, 'fullPrice', fullPrice)
  // }

  // apply inclusive taxes

  let inclusiveRatesSum = 0
  for (const t of taxArray) {
    if (isInclusive(t) && _.has(taxRates, t.id)) {
      const rateNum = taxRates[t.id]
      const rate = _.get(t, ['rates', rateNum])
      inclusiveRatesSum = inclusiveRatesSum + rate
    }
  }

  // const itemsPrice = subtotalWithDocDiscount / (100 + inclusiveRatesSum) * 100
  const itemsPrice = _.round(subtotalWithDocDiscount / (100 + inclusiveRatesSum) * 100, 2)

  for (const t of taxArray) {
    if (_.has(taxRates, t.id)) {
      const rateNum = taxRates[t.id]
      const rate = _.get(t, ['rates', rateNum])
      // console.log('need apply tax', t.id, rate)
      let priceForTax = itemsPrice
      if (_.has(t, 'accumulativeOf')) {
        const accumulativeOf = _.get(t, 'accumulativeOf', [])
        for (const accTaxId of accumulativeOf) {
          priceForTax = priceForTax + _.get(appliedTaxes, [accTaxId, 'taxValue'], 0)
        }
      }
      const taxValue = _.round(priceForTax * rate / 100, 2)
      if (t.type !== INCLUSIVE || _.has(t, 'accumulativeOf')) {
        total = total + taxValue
      }
      appliedTaxes[t.id] = {
        rate,
        priceForTax,
        taxValue,
        tax: t
      }
    }
  }

  // console.log('appliedTaxes', appliedTaxes)
  // console.log('TOTAL', total)
  return {
    discount: discountValue,
    subtotal,
    total,
    appliedTaxes,
    rawItemPrice: itemsPrice
  }
}
