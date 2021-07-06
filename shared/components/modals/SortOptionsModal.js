import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import ElevatedView from 'react-native-elevated-view'

import Modal from 'components/modals/Modal'
import OptionsList from 'components/modals/OptionsList'
import { StyledText } from 'components/StyledComponents'
import { getHeight, getWidth } from 'utils/DynamicSize'
import { localizeText } from 'model/selectors/localize'
import { DUSK, WHITE, AQUA_MARINE, STEEL } from 'constants/colors'

const HEIGHT = 37
const MARGIN = 10

const Buttons = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const TouchableWrapper = styled.TouchableOpacity`
  height: ${props => getHeight(HEIGHT, props.viewport)};
  padding-horizontal: ${props => getWidth(8, props.viewport)};
  margin-horizontal: ${props => getWidth(18, props.viewport)};
  align-items: center;
  flex-direction: row;
`
const StyledElevatedView = styled(ElevatedView)`
  height: ${props => getHeight(HEIGHT, props.viewport)};
  margin-horizontal: ${props => getWidth(18, props.viewport)};
  margin-vertical: ${props => getHeight(MARGIN, props.viewport)};
  border-radius: 8;
`
const DoneWrapper = styled.TouchableOpacity`
  height: ${props => getHeight(HEIGHT, props.viewport)};
  padding-horizontal: ${props => getHeight(18, props.viewport)};
  flex-direction: row;
  align-self: center;
  background-color: ${AQUA_MARINE};
  align-items: center;
  justify-content: space-between;
  border-radius: 8;
`
const OptionWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

const CancelButton = ({ viewport, title, onPress }) => {
  return (
    <TouchableWrapper viewport={viewport} onPress={onPress}>
      <StyledText color={DUSK} letterSpacing={0.04} fontSize={16}>{title}</StyledText>
    </TouchableWrapper>
  )
}
const DoneButton = ({ viewport, title, onPress }) => {
  return (
    <StyledElevatedView viewport={viewport} elevation={2}>
      <DoneWrapper viewport={viewport} activeOpacity={0.75} onPress={onPress}>
        <StyledText color={WHITE} fontSize={16} textAlign='center' letterSpacing={0.44}>
          {title}
        </StyledText>
      </DoneWrapper>
    </StyledElevatedView>
  )
}
const Option = ({ title, selected }) => {
  return (
    <OptionWrapper>
      <StyledText fontSize={16} textAlign='center' color={selected ? DUSK : STEEL}>
        {title}
      </StyledText>
    </OptionWrapper>
  )
}

class SortOptionsModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: props.selectedId
    }
  }

  select = (selected) => () => {
    this.setState({ selected })
  }

  onDone = () => {
    const { onSelect } = this.props
    const { selected } = this.state
    onSelect(selected)
  }

  render () {
    const { viewport, localize, visible, onClose, options } = this.props
    const { selected } = this.state
    const sectionsData = _.map(options, (opt, i) => {
      return {
        title: opt.title,
        key: i,
        customContent: <Option title={opt.title} selected={opt.id === selected} />,
        onPress: this.select(opt.id)
      }
    })
    return (
      <Modal
        isVisible={visible}
        withClose={false}
        marginTop={10}
        onClose={onClose}
        showCancel={false}
      >
        <Buttons>
          <CancelButton viewport={viewport} title={localize('cancel')} onPress={onClose} />
          <DoneButton viewport={viewport} title={localize('done')} onPress={this.onDone} />
        </Buttons>
        <OptionsList sectionsData={sectionsData} />
      </Modal>
    )
  }
}

SortOptionsModal.propTypes = {
  noCheckBox: PropTypes.bool,
  options: PropTypes.array,
  selectedId: PropTypes.any,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  localize: localizeText(state)
})

export default connect(mapStateToProps)(SortOptionsModal)
