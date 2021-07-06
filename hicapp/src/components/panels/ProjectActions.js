import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { View } from 'react-native'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { StyledText } from 'shared/components/StyledComponents'
import { DUSK_TWO, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import { fontSize } from 'shared/utils/dynamicSize'
import IconDraftOrder from 'shared/icons/DraftOrder'
import IconExchange from 'shared/icons/Exchange'
import IconTroubleshoot from 'shared/icons/Troubleshoot'
import IconChecklist from 'shared/icons/Checklist'
import IconTransactionFeeDollar from 'shared/icons/TransactionFeeDollar'

const IconContainer = styled(View)`
  width: ${props => fontSize(32, props.viewport)};
  height: ${props => fontSize(20, props.viewport)};
  /* align-items: center; */
  justify-content: center;
`
const ModalContentWrapper = styled(View)`
  flex: 1;
`
const Row = styled(View)`
 flex-direction: row;
 align-items: center;
 justify-content: center;
`

export const CREATE_PROPOSAL = 'Create proposal'
export const ADD_CHANGE_ORDER = 'Add change order'
export const ADD_WORK_ORDER = 'Add work order'
export const ADD_COMPLETION_FORM = 'Add completion form'
export const CREATE_FUND_REQUEST = 'Request funds from Mason'

export const actions = {
  CREATE_PROPOSAL,
  ADD_CHANGE_ORDER,
  ADD_WORK_ORDER,
  ADD_COMPLETION_FORM,
  CREATE_FUND_REQUEST
}

class ProjectActions extends Component {
  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  renderItem = (itemKind) => {
    const { viewport } = this.props
    let icon = null
    switch (itemKind) {
      case CREATE_PROPOSAL:
        icon = <IconDraftOrder color={DUSK_TWO} size={20} />
        break
      case ADD_CHANGE_ORDER:
        icon = <IconExchange color={DUSK_TWO} size={20} />
        break
      case ADD_WORK_ORDER:
        icon = <IconTroubleshoot color={DUSK_TWO} size={20} />
        break
      case ADD_COMPLETION_FORM:
        icon = <IconChecklist color={DUSK_TWO} size={20} />
        break
      case CREATE_FUND_REQUEST:
        icon = <IconTransactionFeeDollar color={DUSK_TWO} size={20} />
        break
    }
    return (
      <Row>
        <IconContainer viewport={viewport}>
          {icon}
        </IconContainer>
        <StyledText
          color={DUSK_TWO}
          bold
        >
          {itemKind}
        </StyledText>
      </Row>
    )
  }

  render () {
    const { viewport, visible, onClose } = this.props
    const items = _.map(actions, k => ({
      customContent: this.renderItem(k),
      key: k,
      onPress: this.onPress(k)
    }))
    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        onClose={onClose}
        showCross={false}
        percHeight={0.5}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Actions' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList
            sections={[{
              noBorder: true,
              data: items
            }]}
            noHeader
          />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

ProjectActions.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

ProjectActions.propTypes = {
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ProjectActions)
