import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import styled from 'styled-components'
import moment from 'moment'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { AQUA_MARINE, BLACK10, PALE_GREY, STEEL, WHITE } from 'shared/constants/colors'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import { StyledText } from 'shared/components/StyledComponents'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import TextWithChevron from 'shared/components/sections/TextWithChevron'
import { getProgressPaymentsSum } from 'shared/utils/proposal'

const HeaderContainer = styled.View`
  height: ${props => getHeight(150, props.viewport)};
  padding-horizontal: ${props => getWidth(10, props.viewport)};
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom-width: 1;
  border-color: ${BLACK10};
`

@withMappedNavigationParams()
class ScheduleOfProgressPayments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      progressPayments: props.progressPayments
    }
  }

  renderFooter = () => {
    const { viewport } = this.props
    return (
      <HeaderContainer viewport={viewport}>
        <StyledText color={STEEL}>
          The schedule of progress payments describes each phase of work, including the type and amount of work or
          services scheduled to be supplied in each phase along with the amount of each proposed progress payment.
        </StyledText>
      </HeaderContainer>
    )
  }

  savePhase = (item) => {
    const { progressPayments } = this.state
    this.setState({
      progressPayments: {
        ...progressPayments,
        [item.id]: item
      }
    })
  }

  toAddProgressPaymentItem = () => {
    const { nonFinancedAmount } = this.props
    const { progressPayments } = this.state
    const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
    const options = {
      save: this.savePhase,
      maxValue: nonFinancedAmount - progressPaymentsSum
    }
    navigationService.push(screens.PROGRESS_PAYMENTS_PHASE, options)
  }

  deletePhase = (phaseId) => () => {
    const { progressPayments } = this.state
    const progressPaymentsCopy = { ...progressPayments }
    delete progressPaymentsCopy[phaseId]
    this.setState({ progressPayments: progressPaymentsCopy })
  }

  toEditPhase = (pp) => () => {
    const { nonFinancedAmount } = this.props
    const { progressPayments } = this.state
    const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
    const options = {
      save: this.savePhase,
      phase: pp,
      maxValue: nonFinancedAmount - progressPaymentsSum + pp.cost,
      remove: this.deletePhase(pp.id)
    }
    navigationService.push(screens.PROGRESS_PAYMENTS_PHASE, options)
  }

  sections = () => {
    const { nonFinancedAmount, editable } = this.props
    const { progressPayments } = this.state
    const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
    let data = _.map(progressPayments, (pp, ppId) => {
      const strDate = pp.date ? moment(pp.date).format('MM/DD/YYYY') : ' - '
      return {
        title: pp.name,
        desc: strDate,
        key: ppId,
        actionField: <TextWithChevron value={moneyWithSymbolAbbr(pp.cost)} hideChevron={!editable} />,
        notClickable: !editable,
        onPress: this.toEditPhase(pp),
        timestamp: pp.date ? moment(pp.date).unix() : Number.MAX_VALUE
      }
    })
    data = _.sortBy(data, 'timestamp')
    const defaultItemCost = nonFinancedAmount - progressPaymentsSum
    if (defaultItemCost > 0) {
      data.push({
        key: 'default_item',
        title: 'Completion of all work',
        notClickable: true,
        actionField: <TextWithChevron value={moneyWithSymbolAbbr(defaultItemCost)} hideChevron />
      })
      if (editable) {
        data.push({
          title: 'Add phase of work',
          key: 'add_phase',
          onPress: this.toAddProgressPaymentItem,
          addNewField: true
        })
      }
    }

    const res = [
      {
        title: 'SCHEDULE OF PROGRESS PAYMENTS',
        data,
        footer: this.renderFooter()
      }
    ]
    return res
  }

  save = () => {
    const { progressPayments } = this.state
    const { save } = this.props
    console.log('Saving progress payments', progressPayments)
    save(progressPayments)
    navigationService.goBack()
  }

  renderTitle = () => {
    const { nonFinancedAmount } = this.props
    return (
      <TitleWithDesc
        title={'Schedule of payments'}
        desc={moneyWithSymbolAbbr(nonFinancedAmount)}
      />
    )
  }

  render () {
    const { editable } = this.props
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={this.renderTitle()}
          leftButton={<BackButton />}
          rightButton={editable ? {
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          } : null}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
      </Page>
    )
  }
}

ScheduleOfProgressPayments.defaultProps = {
  editable: true
}

ScheduleOfProgressPayments.propTypes = {
  nonFinancedAmount: PropTypes.number,
  progressPayments: PropTypes.object,
  save: PropTypes.func,
  editable: PropTypes.bool
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ScheduleOfProgressPayments)
