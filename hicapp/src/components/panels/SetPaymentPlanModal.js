import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import SectionList from 'shared/components/sections/SectionList'
import { AQUA_MARINE, BLACK10, DEEP_SKY_BLUE, SILVER_SAND, WHITE } from 'shared/constants/colors'
import { fontSize, getHeight } from 'shared/utils/dynamicSize'
import { DEFAULT_FONT, SUBTITLE_FONT_SIZE } from 'constants/index'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import CalendarIcon from 'assets/images/calendar-tick-skyblue.png'
import CircleTickIcon from 'assets/images/circle-tick.png'

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${WHITE};
`

const SubTitle = styled.Text`
  font-family: ${DEFAULT_FONT};
  color: ${SILVER_SAND};
  text-align: center;
  padding-bottom: ${({ viewport }) => getHeight(10, viewport)}
  font-size: ${({ viewport }) => fontSize(SUBTITLE_FONT_SIZE, viewport)}px;
`

class SetPaymentPlan extends Component {
  sections = () => {
    return [
      {
        title: 'Entire amount due upon completion',
        key: 'entireAmount',
        customImage: CircleTickIcon,
        noAction: true,
        wrapperCustomStyle: {
          borderTopWidth: 1,
          borderColor: BLACK10
        },
        customTitleColor: DEEP_SKY_BLUE,
        onPress: () => this.props.onSave()
      },
      {
        title: 'Set custom payment schedule',
        key: 'customSchedule',
        noAction: true,
        customImage: CalendarIcon,
        customTitleColor: DEEP_SKY_BLUE,
        onPress: () => this.props.toProgressPayments()
      }
    ]
  }

  render () {
    const { viewport, visible, onClose } = this.props
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        percHeight={0.4}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Remaining balance' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SubTitle viewport={viewport}>Progress payments</SubTitle>
          <SectionList
            sections={[{ data: this.sections() }]}
            noHeader
          />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

SetPaymentPlan.defaultProps = {
  visible: false,
  onClose: () => null
}

SetPaymentPlan.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SetPaymentPlan)
