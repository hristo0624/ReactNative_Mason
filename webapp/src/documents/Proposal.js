import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import moment from 'moment'
import converter from 'number-to-words'

import Page from 'src/documents/components/Page'
import { TWILIGHT_BLUE, LIGHT_GREY_BLUE } from 'constants/colors'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import PaymentPlanDesc from 'documents/components/PaymentPlanDesc'
import { getAmountToFinance, isProjectCostCalculated, getBalanceDue, getProgressPaymentsSum } from 'shared/utils/proposal'

const SpaceBetweenFlexDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  ${props => props.customStyle || ''}
`
const HeaderText = styled.span`
  color: ${TWILIGHT_BLUE};
  font-weight: 600;
  font-size: 2em;
`
const ContactsBlock = styled.div`
  display: flex;
  margin-top: 1em;
`
const ClientInfoContainer = styled.div`
  flex: 1;
  border-left: 0.4em solid ${TWILIGHT_BLUE};
  padding: 0.8em;
`
const ContractorInfoContainer = styled.div`
  flex: 1;
  padding: 0.8em;
`
const BoldText = styled.span`
  color: #000;
  font-weight: 600;
  font-size: 1.4em;
  ${props => props.customStyle || ''}
`
const InfoDetails = styled.div`
  margin-top: 1em;
`
const Text = styled.span`
  color: #000;
  font-size: 1.2em;
  line-height: 1.5em;
  white-space: pre-line;
  ${props => props.customStyle || ''};
`
const WorkDescriptionHeader = styled.div`
  width: 100%;
  margin-top: 4em;
  margin-bottom: 2em;
  text-align: center;
`
const WorkDescriptionTableHeader = styled.div`
  width: 100%;
  margin-top: 1em;
  text-align: center;
  padding: 0.5em 0;
  border-bottom: 0.2em solid ${TWILIGHT_BLUE};
`

const LineItemsBlock = styled.div`
  border-bottom: 0.2em solid ${TWILIGHT_BLUE};
`
const LineItemRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0em;
`

const Cell = styled.div`
  flex: ${props => props.flex || 1};
  text-align: ${props => props.textAlign || 'left'};
  display: flex;
  flex-direction: column;
`
const TotalBlock = styled.div`
  margin-top: 6em;
`
const LineItemsTotal = styled.div`
  flex: 2;
  height: 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PaymentTermRow = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 0.5em;
`
const PaymentTermsContainer = styled.div`
  margin-top: 2em;
`

const Proposal = (props) => {
  // console.log('render proposal props', props)
  const m = moment(props.date)

  let addressLine1 = _.get(props, 'address.structured.main')
  if (addressLine1 && _.has(props, 'apartment')) addressLine1 = `${addressLine1}, ${props.apartment}`
  const addressLine2 = _.get(props, 'address.structured.secondary', '')
  const projectCost = _.get(props, 'projectCost')
  const cents = (projectCost - Math.floor(projectCost)) * 100
  const depositValue = _.get(props, 'deposit.value', 0)
  const lineItems = _.get(props, 'lineItems', {})
  const isCalculated = isProjectCostCalculated(lineItems)
  const balanceDue = getBalanceDue(props)

  const paymentsTerms = []

  const planAmount = _.get(props, 'plan.amount', 0)
  const amountToFinance = getAmountToFinance(props)
  if (amountToFinance > 0 && planAmount > 0) {
    const ppm = _.round(amountToFinance / planAmount, 2)
    paymentsTerms.push(
      <SpaceBetweenFlexDiv>
        <Text customStyle={'flex: 5'}>{planAmount} Monthly payments due on the 1st day of each month.<br /> (1st payment due July 1st 2019 - fix the date)</Text>
        <Text customStyle={'flex: 1; text-align: right;'}>{planAmount} x {moneyWithSymbolAbbr(ppm)}</Text>
      </SpaceBetweenFlexDiv>
    )
  }

  const nonFinancedValue = balanceDue - amountToFinance
  if (amountToFinance < balanceDue) {
    paymentsTerms.push(
      <Text>
        Remaining balance of {moneyWithSymbolAbbr(nonFinancedValue)} will be fulfilled as progress payments according to the Schedule below.
      </Text>
    )
  }

  const renderTableHeader = () => {
    if (isCalculated) {
      return (
        <LineItemRow>
          <Cell flex={4}><BoldText>Description</BoldText></Cell>
          <Cell><BoldText>Quantity</BoldText></Cell>
          <Cell><BoldText>Rate</BoldText></Cell>
          <Cell textAlign='right'><BoldText>Amount</BoldText></Cell>
        </LineItemRow>
      )
    } else {
      return (
        <LineItemRow>
          <Cell flex={4}><BoldText>Description</BoldText></Cell>
        </LineItemRow>
      )
    }
  }

  const renderLineItem = (item, itemId) => {
    if (isCalculated) {
      const qty = _.get(item, 'quantity', '')
      const cost = _.get(item, 'cost', 0)
      return (
        <LineItemRow key={itemId}>
          <Cell flex={4}>
            <Text>{item.name}</Text>
            <Text customStyle={'margin-left: 1em; font-size: 1em;'}>{item.desc}</Text>
          </Cell>
          <Cell><Text>{qty}</Text></Cell>
          <Cell><Text>{cost > 0 && _.has(item, 'quantity') ? moneyWithSymbolAbbr(item.cost, '$') : ''}</Text></Cell>
          <Cell textAlign='right'>
            <Text>
              {cost > 0 ? moneyWithSymbolAbbr(item.cost * (qty || 1), '$') : ''}
            </Text>
          </Cell>
        </LineItemRow>
      )
    } else {
      return (
        <LineItemRow key={itemId}>
          <Cell flex={4}>
            <Text>{item.name}</Text>
            <Text customStyle={'margin-left: 1em; font-size: 1em;'}>{item.desc}</Text>
          </Cell>
        </LineItemRow>
      )
    }
  }

  const renderTotal = () => {
    if (isCalculated) {
      return (
        <SpaceBetweenFlexDiv>
          <div style={{ flex: 5 }} />
          <LineItemsTotal>
            <BoldText>Total:</BoldText>
            <BoldText>{moneyWithSymbolAbbr(projectCost, '$')}</BoldText>
          </LineItemsTotal>
        </SpaceBetweenFlexDiv>
      )
    }
  }

  const renderDeposit = () => {
    if (isCalculated && depositValue) {
      return (
        <SpaceBetweenFlexDiv>
          <div style={{ flex: 5 }} />
          <LineItemsTotal>
            <Text>Deposit:</Text>
            <Text>{moneyWithSymbolAbbr(depositValue, '$')}</Text>
          </LineItemsTotal>
        </SpaceBetweenFlexDiv>
      )
    }
  }

  const renderWorkDescriptionTable = () => {
    if (_.isEmpty(lineItems)) {
      return null
    } else {
      return (
        <React.Fragment>
          <p>
            <Text>
              We hereby propose to furnish all materials and necessary equipment, and perform all labor necessary to completethe following work:
            </Text>
          </p>

          <WorkDescriptionTableHeader>
            {renderTableHeader()}
          </WorkDescriptionTableHeader>

          <LineItemsBlock>
            {_.map(props.lineItems, renderLineItem)}
          </LineItemsBlock>

          {renderTotal()}
          {renderDeposit()}
        </React.Fragment>
      )
    }
  }

  const renderPaymentTerms = () => {
    if (paymentsTerms.length > 0) {
      return (
        <PaymentTermsContainer>
          {_.map(paymentsTerms, (pt, i) => (
            <PaymentTermRow key={i}>
              <Text customStyle='margin-right: 0.5em;'>{i + 1}.</Text>
              {pt}
            </PaymentTermRow>
          ))}
        </PaymentTermsContainer>
      )
    }
  }

  const renderApproximateDates = () => {
    const startDateM = moment(_.get(props, 'startDate'))
    const endDateM = moment(_.get(props, 'endDate'))
    return (
      <SpaceBetweenFlexDiv customStyle={'margin-top: 2em;'}>
        <Text>Approximate start date: <u>{startDateM.format('MM/DD/YYYY')}</u></Text>
        <Text>Approximate completion date: <u>{endDateM.format('MM/DD/YYYY')}</u></Text>
      </SpaceBetweenFlexDiv>
    )
  }

  const renderSchedulePayments = () => {
    if (nonFinancedValue > 0) {
      const progressPayments = _.get(props, 'progressPayments', {})
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      const items = _.values(progressPayments)
      const sortedItems = _.sortBy(items, item => item.date ? moment(item.date).unix() : Number.MAX_VALUE)
      console.log('items', items)
      console.log('sorted items', sortedItems)
      if (progressPaymentsSum < nonFinancedValue) {
        sortedItems.push({
          id: 'default',
          name: 'Completion of all work',
          cost: nonFinancedValue - progressPaymentsSum,
          date: null
        })
      }
      return (
        <React.Fragment>
          <WorkDescriptionTableHeader>
            <LineItemRow>
              <Cell><BoldText>Amount</BoldText></Cell>
              <Cell flex={4}><BoldText>Description</BoldText></Cell>
              <Cell textAlign='right'><BoldText>Date</BoldText></Cell>
            </LineItemRow>
          </WorkDescriptionTableHeader>

          <LineItemsBlock>
            {_.map(sortedItems, item => (
              <LineItemRow key={item.id}>
                <Cell><Text>{moneyWithSymbolAbbr(item.cost)}</Text></Cell>
                <Cell flex={4}><Text>{item.name}</Text></Cell>
                <Cell textAlign='right'><Text>{ item.date ? moment(item.date).format('MM/DD/YYYY') : null}</Text></Cell>
              </LineItemRow>
            ))}
          </LineItemsBlock>
        </React.Fragment>
      )
    }
  }

  const page1 = (
    <Page>
      <SpaceBetweenFlexDiv customStyle='text-align: center'>
        <HeaderText>{_.get(props, 'company.name')}</HeaderText>
        <HeaderText>PROPOSAL</HeaderText>
      </SpaceBetweenFlexDiv>

      <ContactsBlock>
        <ClientInfoContainer>
          <BoldText>Prepared for:</BoldText>
          <InfoDetails>
            <p>
              <Text>{props.owner.firstName} </Text>
              <Text>{props.owner.lastName}</Text>
            </p>
            <p><Text>{addressLine1}</Text></p>
            <p><Text>{addressLine2}</Text></p>
            <p><Text>{_.get(props, 'share.email', '')}</Text></p>
          </InfoDetails>
        </ClientInfoContainer>
        <ContractorInfoContainer>
          <SpaceBetweenFlexDiv>
            <BoldText customStyle={`color: ${LIGHT_GREY_BLUE};`}>{m.format('MMM D, YYYY')}</BoldText>
            <BoldText customStyle={`color: ${LIGHT_GREY_BLUE};`}>#{props.docNum}</BoldText>
          </SpaceBetweenFlexDiv>
          <InfoDetails>
            <p><Text customStyle={`color: ${LIGHT_GREY_BLUE};`}>{_.get(props, 'company.name')}</Text></p>
            <p><Text customStyle={`color: ${LIGHT_GREY_BLUE};`}>{_.get(props, 'company.email', '')}</Text></p>
            <p><Text customStyle={`color: ${LIGHT_GREY_BLUE};`}>{_.get(props, 'company.phone', '')}</Text></p>
          </InfoDetails>
        </ContractorInfoContainer>
      </ContactsBlock>

      <WorkDescriptionHeader>
        <BoldText>WORK DESCRIPTION</BoldText>
      </WorkDescriptionHeader>

      {renderWorkDescriptionTable()}
      {renderApproximateDates()}
      {renderPaymentTerms()}
      {renderSchedulePayments()}

      <TotalBlock>
        <p>
          <Text>We propose hereby to furnish material and labor - complete in accordiance with above specifications for the sum of: <b>{converter.toWords(projectCost)}  dollars {cents > 0 ? `and ${converter.toWords(cents)} cents` : ''} ({moneyWithSymbolAbbr(projectCost, '$')} </b>)</Text>
        </p>
        <p>
          <Text>
            <PaymentPlanDesc
              amountToFinance={getAmountToFinance(props)}
              deposit={depositValue}
              monthAmount={_.get(props, 'plan.amount')}
              sameAsCash={_.get(props, 'sameAsCash')}
            />
          </Text>
        </p>
        {_.has(props, 'addendums') ? <p><Text>{props.addendums}</Text></p> : null}
      </TotalBlock>

    </Page>
  )

  return (
    <React.Fragment>
      {page1}
    </React.Fragment>
  )
}

Proposal.defaultProps = {
  company: {
    name: 'Company name'
  },
  owner: {
    firstName: 'John',
    lastName: 'Doe'
  },
  date: _.now(),
  docNum: '1001',
  lineItems: {},
  projectCost: 0,
  deposit: 0
}

Proposal.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string
  }),
  owner: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string
  }),
  date: PropTypes.number,
  docNum: PropTypes.string,
  address: PropTypes.object,
  apartment: PropTypes.string,
  lineItems: PropTypes.object,
  projectCost: PropTypes.number,
  deposit: PropTypes.object
}

export default Proposal
