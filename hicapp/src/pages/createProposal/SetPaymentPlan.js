import React, {Component} from 'react'
import {connect} from 'react-redux'
import {InteractionManager, Text, View} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {withMappedNavigationParams} from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import SetPaymentPlanModal from 'components/panels/SetPaymentPlanModal'
import navigationService from 'shared/navigation/service'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import {AQUA_MARINE, BLACK10, PALE_GREY, SILVER_SAND, WHITE} from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import {moneyWithSymbolAbbr} from 'shared/utils/money'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import {StyledText} from 'shared/components/StyledComponents'
import styled from 'styled-components'
import {fontSize, getHeight} from 'shared/utils/dynamicSize'
import Checkbox from 'shared/icons/Checkbox'
import {
  getBalanceDue,
  getNonFinancedAmount,
  getProgressPaymentsSum,
  getUpdatedDepositValue
} from '../../../../shared/utils/proposal'
import TextWithChevron from '../../../../shared/components/sections/TextWithChevron'
import screens from '../../constants/screens'
import CalendarTick from 'assets/images/calendar-tick.png'
import {DEFAULT_FONT} from 'constants/index'

const HeaderContainer = styled.View`
  height: ${props => getHeight(150, props.viewport)};
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom-width: 1;
  border-color: ${BLACK10};
`

@withMappedNavigationParams()
class SetPaymentPlan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      amountToFinance: props.options.amountToFinance,
      plan: props.options.plan,
      proposal: props.options.proposal,
      modalVisible: false
    }
  }
  
  showSetPaymentPlanModal = () => this.setState({modalVisible: true})
  
  hideSetPaymentPlanModal = () => this.setState({modalVisible: false})
  
  renderSetPaymentPlanModal = () => {
    const {modalVisible} = this.state
    return (
      <SetPaymentPlanModal
        onSave={() => {
          this.hideSetPaymentPlanModal()
          InteractionManager.runAfterInteractions(() => {
            this.handleChange('progressPayments')({})
            this.savePaymentPlan()
          })
        }}
        toProgressPayments={() => {
          this.hideSetPaymentPlanModal()
          InteractionManager.runAfterInteractions(() => {
            this.toScheduleOfProgressPayments()
          })
        }}
        visible={modalVisible}
        onClose={this.hideSetPaymentPlanModal}
      />
    )
  }
  
  handleAmountOfFinanceChange = (v) => {
    const {proposal} = this.state
    const balanceDue = getBalanceDue(proposal)
    if (v !== '') {
      let res = '0'
      let amount = _.round(v, 2)
      if (_.isNaN(amount)) amount = 0
      console.log('amount row', v, 'rounded', amount)
      if (amount > balanceDue) {
        res = _.toString(balanceDue)
      } else if (amount < 0) {
        res = '0'
      } else {
        res = _.toString(amount)
      }
      return this.handleChange('amountToFinance')(res)
    } else {
      return this.handleChange('amountToFinance')(v)
    }
  }
  
  renderCheckbox = (v) => {
    const {viewport} = this.props
    const {proposal} = this.state
    const plan = _.get(proposal, 'plan')
    const balanceDue = getBalanceDue(proposal)
    
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    
    if (!Number(realAmountToFinance)) {
      return <View/>
    }
    
    if (plan && plan.id === v) {
      return <Checkbox color={AQUA_MARINE} size={getHeight(26, viewport)}/>
    } else {
      return <View/>
    }
  }
  
  onSelectPlan = (p) => () => {
    const {proposal} = this.state
    const plan = _.get(proposal, 'plan', {})
    if (p.id !== plan.id) {
      return this.handleChange('plan')(p)
    }
    return this.handleChange('plan')(null)
  }
  
  paymentPlanSections = () => {
    const {plans} = this.props
    const {proposal} = this.state
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    const res = _.map(plans, (p, planId) => {
      let title = 'No payment plan'
      let desc = 'No contractor fee'
      if (p.amount > 0) {
        const ppm = _.round(realAmountToFinance / p.amount, 2)
        title = realAmountToFinance > 0 ? `${p.amount} payments of ${moneyWithSymbolAbbr(ppm)}` : `${p.amount} payments`
        desc = `${p.fee}% contractor fee`
      }
      return {
        title,
        key: planId,
        desc,
        disabled: !Number(realAmountToFinance),
        onPress: this.onSelectPlan(p),
        actionField: this.renderCheckbox(planId),
        amount: p.amount
      }
    })
    return {
      title: 'TERM',
      data: res
    }
  }
  
  progressPayments = () => {
    return ({
      title: 'PROGRESS PAYMENTS',
      data: this.progressPaymentsRow()
    })
  }
  
  progressPaymentsRow = () => {
    const {proposal} = this.state
    const {viewport} = this.props
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const progressPayments = _.get(proposal, 'progressPayments', {})
    const showPaymentProgressRow = !_.isNil(amountToFinance) && amountToFinance < balanceDue
    
    if (!_.get(proposal, 'progressPayments')) {
      return [{
        title: 'Set schedule of payments',
        key: 'progressPayments',
        disabled: !showPaymentProgressRow,
        onPress: this.toScheduleOfProgressPayments,
        customImage: CalendarTick
      }]
    }
    const nonFinancedAmount = getNonFinancedAmount(proposal)
    const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
    const defaultItemCost = nonFinancedAmount - progressPaymentsSum
    let itemsCount = _.size(progressPayments)
    console.log('progressPayments', progressPayments)
    const progressPaymentsDescription = []
    if (defaultItemCost > 0) {
      progressPaymentsDescription.push({
        key: 'completion_all_work', text: `Completion of all work - ${moneyWithSymbolAbbr(defaultItemCost)}`
      })
      itemsCount = itemsCount + 1
    }
    
    const fullProgressPaymentDescription = [...progressPaymentsDescription, ..._.keys(progressPayments)
      .map((key) => {
        console.log({
          key, text: `${progressPayments[key].name} - ${moneyWithSymbolAbbr(progressPayments[key].cost)}`
        })
        return {
          key, text: `${progressPayments[key].name} - ${moneyWithSymbolAbbr(progressPayments[key].cost)}`
        }
      })]
    console.log('fullProgressPaymentDescription', fullProgressPaymentDescription)
    const descriptionElement = (
      <View style={{display: 'flex', flexDirection: 'column'}}>
        {
          fullProgressPaymentDescription.map((item) => <Text key={item.key}
                                                             style={{
                                                               fontFamily: DEFAULT_FONT,
                                                               fontSize: fontSize(12, viewport),
                                                               color: SILVER_SAND
                                                             }}>{item.text}</Text>)}
      </View>
    )
    
    return [{
      title: 'Schedule of progress payments',
      key: 'progressPayments',
      desc: descriptionElement,
      actionField: !progressPaymentsDescription.length &&
        <TextWithChevron value={moneyWithSymbolAbbr(balanceDue - amountToFinance)}/>,
      onPress: this.toScheduleOfProgressPayments,
      customImage: !progressPaymentsDescription.length && CalendarTick
    }]
  }
  
  handleChange = fieldName => v => {
    const {proposal} = this.state
    const {plans} = this.props
    const proposalCopy = {...proposal}
    _.set(proposalCopy, fieldName, v)
    if (_.get(proposalCopy, 'amountToFinance') === 0 || (fieldName === 'plan' && _.isNil(v))) {
      _.set(proposalCopy, 'plan', plans.none)
    }
    if (fieldName === 'amountToFinance') {
      const deposit = getUpdatedDepositValue(_.get(proposalCopy, 'projectCost'), proposalCopy.deposit)
      _.set(proposalCopy, 'deposit', deposit)
      let amountToFinance = _.get(proposalCopy, 'amountToFinance')
      const balanceDue = getBalanceDue(proposalCopy)
      if (!_.isNil(amountToFinance) && amountToFinance > balanceDue) {
        amountToFinance = balanceDue
      }
      _.set(proposalCopy, 'amountToFinance', amountToFinance)
      const progressPayments = _.get(proposalCopy, 'progressPayments')
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      const nonFinancedAmount = balanceDue - _.get(proposalCopy, 'amountToFinance', 0)
      if (progressPaymentsSum > nonFinancedAmount) {
        _.set(proposalCopy, 'progressPayments', {})
      }
      console.log('proposalCopy', proposalCopy)
    }
    return this.setState({proposal: proposalCopy})
  }
  
  toScheduleOfProgressPayments = () => {
    const {proposal} = this.state
    const options = {
      progressPayments: _.get(proposal, 'progressPayments', {}),
      nonFinancedAmount: getNonFinancedAmount(proposal),
      save: this.handleChange('progressPayments')
    }
    navigationService.push(screens.SCHEDULE_OF_PROGRESS_PAYMENTS, options)
  }
  
  amountToFinance = () => {
    const {proposal} = this.state
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    return ({
      customHeader: this.renderHeader(),
      title: 'WITHIN PAYMENT PLAN',
      data: [
        {
          title: 'Amount to finance',
          key: 'amountToFinance',
          actionField: (
            <SectionItemInput
              value={_.toString(amountToFinance)}
              blurValue={moneyWithSymbolAbbr(realAmountToFinance)}
              onChange={this.handleAmountOfFinanceChange}
              keyboardType='decimal-pad'
            />
          )
        }
      ]
    })
  }
  
  sections = () => {
    return [
      {...this.amountToFinance()},
      {...this.paymentPlanSections()},
      {...this.progressPayments()}
    ]
  }
  
  save = () => {
    const {proposal} = this.state
    const {options} = this.props
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const showPaymentProgressRow = !_.isNil(amountToFinance) && amountToFinance < balanceDue
    if (showPaymentProgressRow && !_.get(proposal, 'progressPayments')) {
      return this.showSetPaymentPlanModal()
    }
    return this.savePaymentPlan()
  }
  
  savePaymentPlan = () => {
    const {proposal} = this.state
    const {options} = this.props
    options.save(proposal)
    navigationService.goBack()
  }
  
  renderHeader = () => {
    const {viewport} = this.props
    const {proposal} = this.state
    const balanceDue = getBalanceDue(proposal)
    return (
      <HeaderContainer viewport={viewport}>
        <StyledText fontSize={16}>Balance due</StyledText>
        <StyledText fontSize={36}>
          {moneyWithSymbolAbbr(balanceDue)}
        </StyledText>
      </HeaderContainer>
    )
  }
  
  renderTitle = () => {
    const {proposal} = this.state
    const balanceDue = getBalanceDue(proposal)
    const amountToFinance = _.get(proposal, 'amountToFinance')
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    return (
      <TitleWithDesc
        title={'Payment Plan'}
        desc={moneyWithSymbolAbbr(realAmountToFinance)}
      />
    )
  }
  
  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={this.renderTitle()}
          leftButton={<BackButton/>}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderSetPaymentPlanModal()}
      </Page>
    )
  }
}

SetPaymentPlan.propTypes = {
  addItem: PropTypes.func,
  delItem: PropTypes.func
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  plans: _.get(state, 'references.plans', {})
})

export default connect(mapStateToProps)(SetPaymentPlan)
