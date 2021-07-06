import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { View } from 'react-native'

import SectionList from 'shared/components/sections/SectionList'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import { StyledText } from 'shared/components/StyledComponents'
import { DUSK, PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import NavBar from 'shared/components/NavBar'
import CloseButton from 'shared/components/navbar/CloseButton'
import Checkbox from 'shared/icons/Checkbox'
import { getHeight } from 'shared/utils/dynamicSize'
import { getRolesTitles } from 'model/selectors/rolesSelectors'

const Wrapper = styled.View`
  width: 100%;
  align-items: center;
`
const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${PALE_GREY};
`

class SelectRole extends Component {
  onPress = id => () => {
    const { onSelect, onClose } = this.props
    onSelect(id)
    onClose()
  }

  renderContent = (title) => {
    return (
      <Wrapper>
        <StyledText fontSize={16} color={DUSK}>
          {title}
        </StyledText>
      </Wrapper>
    )
  }

  renderCheckbox = (roleId) => {
    const { value, viewport } = this.props
    if (value === roleId) {
      return <Checkbox color={AQUA_MARINE} size={getHeight(26, viewport)} />
    } else {
      return <View />
    }
  }

  render () {
    const { viewport, visible, onClose, rolesTitles } = this.props
    const items = _.map(rolesTitles, (title, roleId) => {
      return {
        title: title,
        key: roleId,
        onPress: this.onPress(roleId),
        actionField: this.renderCheckbox(roleId)
      }
    })

    return (
      <SlidingUpModal
        visible={visible}
        viewport={viewport}
        title={'Choose role'}
        onClose={onClose}
        showCross={false}
      >
        <ModalContentWrapper viewport={viewport}>
          <NavBar
            backgroundColor={WHITE}
            title={{ title: 'Choose role' }}
            rightButton={<CloseButton color={AQUA_MARINE} onPressHandler={onClose} />}
          />
          <SectionList sections={[{ data: items }]} />
        </ModalContentWrapper>
      </SlidingUpModal>
    )
  }
}

SelectRole.defaultProps = {
  visible: false,
  onSelect: () => null,
  onClose: () => null
}

SelectRole.propTypes = {
  value: PropTypes.string,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  rolesTitles: getRolesTitles(state)
})

export default connect(mapStateToProps)(SelectRole)
