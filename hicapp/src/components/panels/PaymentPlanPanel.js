import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { View } from 'react-native'
import _ from 'lodash'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import Checkbox from 'shared/icons/Checkbox'
import { getHeight } from 'shared/utils/dynamicSize'
import { moneyWithSymbolAbbr } from 'shared/utils/money'

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class PaymentPlanPanel extends Component {
  onSelectPlan = (p) => () => {
    const { onSelect, onClose } = this.props
    onSelect(p)
    onClose()
  }

  renderCheckbox = (v) => {
    const { value, viewport } = this.props
    if (value === v) {
      return <Checkbox color={AQUA_MARINE} size={getHeight(26, viewport)} />
    } else {
      return <View />
    }
  }

  render () {
    const { viewport, visible, onClose, plans, amountToFinance } = this.props
    const res = _.map(plans, (p, planId) => {
      let title = 'No payment plan'
      let desc = 'No contractor fee'
      if (p.amount > 0) {
        const ppm = _.round(amountToFinance / p.amount, 2)
        title = amountToFinance > 0 ? `${p.amount} payments of ${moneyWithSymbolAbbr(ppm)}` : `${p.amount} payments`
        desc = `${p.fee}% contractor fee`
      }
      return {
        title,
        key: planId,
        desc,
        onPress: this.onSelectPlan(p),
        actionField: this.renderCheckbox(planId),
        amount: p.amount
      }
    })
    const plansOptions = _.sortBy(res, 'amount')
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Payment plan term' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList sections={[{ data: plansOptions }]} />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

PaymentPlanPanel.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null,
  amountToFinance: 0
}

PaymentPlanPanel.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  amountToFinance: PropTypes.number
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  plans: _.get(state, 'references.plans', {})
})

export default connect(mapStateToProps)(PaymentPlanPanel)
