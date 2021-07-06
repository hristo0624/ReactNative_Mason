import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import moment from 'moment'

import Page from 'src/documents/components/Page'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import { getAmountToFinance } from 'shared/utils/proposal'

const SpaceBetweenFlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  ${props => props.customStyle || ''}
`
const HeaderText = styled.span`
  font-weight: 600;
  font-size: 2em;
  text-align: center;
`
const Div = styled.div`
  ${props => props.customStyle || ''}
`
const P = styled.p`
  ${props => props.customStyle || ''}
`

export const SignatureImage = styled.img`
  width: 12em;
  height: 6em;
`
const Sig = ({ signature }) => {
  return signature ? <SignatureImage src={signature} alt='signature' /> : null
}
const BoldText = styled.span`
  color: #000;
  font-weight: 600;
  font-size: 1.4em;
  ${props => props.customStyle || ''}
`
const Text = styled.span`
  color: #000;
  font-size: 1.2em;
  line-height: 1.5em;
  ${props => props.customStyle || ''};
`
const SamllText = styled(Text)`
  font-size: 1em;
`

const Contract = (props) => {
  console.log('render contract props', props)
  // const m = moment(props.date)
  const ownerContractSigDate = _.has(props, 'ownerContractSignature.timestamp') ? moment(props.ownerContractSignature.timestamp).format('L') : ''

  let addressLine1 = _.get(props, 'address.structured.main')
  if (addressLine1 && _.has(props, 'apartment')) addressLine1 = `${addressLine1}, ${props.apartment}`
  const addressLine2 = _.get(props, 'address.structured.secondary', '')

  let companyAddressLine1 = _.get(props, 'company.address.structured.main')
  if (companyAddressLine1 && _.has(props, 'company.apartment')) addressLine1 = `${addressLine1}, ${props.company.apartment}`
  const companyAddressLine2 = _.get(props, 'company.address.structured.secondary', '')

  const deposit = _.get(props, 'deposit.value', 0)
  const projectCost = _.get(props, 'projectCost')
  const monthAmount = _.get(props, 'plan.amount')
  let paymentsList = []

  const delta = getAmountToFinance(props)

  if (_.get(props, 'sameAsCash')) {
    if (deposit > 0) {
      paymentsList.push(moneyWithSymbolAbbr(deposit, '$'))
      paymentsList.push(moneyWithSymbolAbbr(delta, '$'))
    } else {
      paymentsList.push(moneyWithSymbolAbbr(projectCost, '$'))
    }
  } else {
    if (deposit > 0) {
      paymentsList.push(moneyWithSymbolAbbr(deposit, '$'))
      const mPayment = moneyWithSymbolAbbr(_.round(delta / monthAmount, 2), '$')
      for (let i = 0; i < monthAmount; i++) {
        paymentsList.push(mPayment)
      }
    } else {
      const mPayment = moneyWithSymbolAbbr(_.round(projectCost / monthAmount, 2), '$')
      for (let i = 0; i < monthAmount; i++) {
        paymentsList.push(mPayment)
      }
    }
  }

  const page1 = (
    <Page>
      <Div customStyle='width: 100%; text-align: center;'>
        <HeaderText>HOME IMPROVEMENT CONTRACT</HeaderText>
      </Div>
      <Div customStyle='width: 100%; text-align: right;'>
        <Text>Contract No. {_.get(props, 'contractNum', '_____')}</Text>
      </Div>
      <Div customStyle='width: 100%; text-align: right;'>
        <Text>Date {_.get(props, 'contractDate', '_____')}</Text>
      </Div>
      <Div customStyle='width: 100%; text-align: center;'>
        <Text>THIS AGREEMENT IS BETWEEN</Text>
      </Div>

      <SpaceBetweenFlexDiv>
        <Div customStyle='flex: 1;'>
          <p><SamllText>{`"Notice of cancellation" may be sent to the `}</SamllText></p>
          <p><SamllText>contractor at the address noted below:</SamllText></p>
          <Div customStyle='text-align: center; margin-top: 2em; padding-right: 5em;'>
            <HeaderText>{props.company.name}</HeaderText>
            <p><Text>{companyAddressLine1}</Text></p>
            <p><Text>{companyAddressLine2}</Text></p>
            <p><Text>{_.get(props, 'company.phone')}</Text></p>
            <p><Text>{_.get(props, 'company.email')}</Text></p>
          </Div>
        </Div>
        <Div customStyle='flex: 1; margin-top: 5em;'>
          <p><Text>Owner's Name: {_.get(props, 'owner.firstName')} {_.get(props, 'owner.lastName')}</Text></p>
          <p><Text>Owner's Address: {addressLine1}</Text></p>
          <p><Text>City, State: {addressLine2}</Text></p>
          <p><Text>Phone: {_.get(props, 'owner.phone', '')}</Text></p>
          <p><Text>Email: {_.get(props, 'owner.email', '')}</Text></p>
        </Div>
      </SpaceBetweenFlexDiv>

      <Div customStyle='margin-top: 3em;'>
        <BoldText>Job location: </BoldText>
        <Text>{addressLine1}, {addressLine2}</Text>
      </Div>

      <Div customStyle='margin-top: 0.5em;'>
        <BoldText>Description of the Project and Description of the Significant Material to be Used and Equipment to be installed:</BoldText>
        {_.map(_.get(props, 'lineItems', {}), (l, lId) =>
          <P key={lId} customStyle='margin-left: 2em;'>
            <Text>
              - {l.name} {l.quantity ? `(Qty. ${l.quantity})` : ''}
            </Text>
          </P>
        )}
      </Div>

      <Div customStyle='margin-top: 0.5em;'>
        <Text>Substantial commencement of work under this contract is described as: _______________________________</Text>
      </Div>

      <SpaceBetweenFlexDiv customStyle='margin-top: 0.5em;'>
        <Div customStyle='flex: 1;'><BoldText>Approximate Starting Date: ____________</BoldText></Div>
        <Div customStyle='flex: 1;'><BoldText>Approximate Completion Date: ____________</BoldText></Div>
      </SpaceBetweenFlexDiv>
      <SpaceBetweenFlexDiv customStyle='margin-top: 0.5em;'>
        <Div customStyle='flex: 1;'><BoldText>Contract price: ${props.projectCost}</BoldText></Div>
        <Div customStyle='flex: 1;'><BoldText>Deposit: ${deposit}</BoldText></Div>
      </SpaceBetweenFlexDiv>

      <Div customStyle='margin-top: 0.5em;'>
        <BoldText>
          Schedule of Progress Payments:
        </BoldText>
        {_.map(paymentsList, (p, i) => <P customStyle='margin-left: 2em;' key={i}><Text>{`- ${p}`}</Text></P>)}
      </Div>

      <Div customStyle='margin-top: 0.5em;'>
        <Text>Upon satisfactory payment being made for any portion of the work performed, the contractor, prior to any further payment being made, chall furnish to the person contracting for the home improvement work a full and unconditional release from any potential lien claimant claim or mechanincs lien pursuant to Sections 8400 and 8404 of the Civil Code for that portion of the work for which payment has been made.</Text>
      </Div>

      <Div customStyle='margin-top: 0.5em;'>
        <BoldText>You are entitled to a complitelly filled in copy of this agreement, signed by both you and the contractor, before any work may be started. The owner or tenant has the right to require the contractor to have a performance and payment bond, hovewer the contractor can charge you for the costs of obtaning a bond. </BoldText>
      </Div>

      {_.has(props, 'addendums')
        ? <Div customStyle='margin-top: 0.5em;'>
          <BoldText>{props.addendums}</BoldText>
        </Div>
        : null
      }

      <SpaceBetweenFlexDiv customStyle='margin-top: 3em;'>
        <Div customStyle='flex: 1;'>
          <p><Text>Owner Signature: <Sig signature={_.get(props, 'ownerContractSignature.src')} /></Text></p>
          <Text>Signature Date: {ownerContractSigDate}</Text>
        </Div>
        <Div customStyle='flex: 1;'>
          <Text>Representative's Signature: <Sig signature={_.get(props, 'signature.url')} /></Text>
          <Text customStyle={'margin-left: 1em;'}>Date: _____</Text>
        </Div>
      </SpaceBetweenFlexDiv>

    </Page>
  )

  return (
    <React.Fragment>
      {page1}
    </React.Fragment>
  )
}

Contract.defaultProps = {
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

Contract.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.object,
    apartment: PropTypes.string
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
  deposit: PropTypes.object,
  addendums: PropTypes.string
}

export default Contract
