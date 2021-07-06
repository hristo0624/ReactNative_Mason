import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import _ from 'lodash'

import Modal from 'components/modals/Modal'
import OptionsList from 'components/modals/OptionsList'
import Checkbox from 'components/Checkbox'

class OptionsListModal extends Component {
  select = (v) => () => {
    this.props.onSelect(v)
  }

  render () {
    const { visible, onClose, title, options, selectedId, noCheckBox } = this.props
    const sectionsData = _.map(options, (opt, i) => {
      return {
        title: opt.title,
        key: i,
        actionField: noCheckBox ? <View /> : <Checkbox checked={opt.id === selectedId} />,
        onPress: this.select(opt.id)
      }
    })
    return (
      <Modal
        isVisible={visible}
        title={title}
        onClose={onClose}
      >
        <OptionsList sectionsData={sectionsData} />
      </Modal>
    )
  }
}

OptionsListModal.propTypes = {
  noCheckBox: PropTypes.bool,
  options: PropTypes.array,
  selectedId: PropTypes.any,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.string
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(OptionsListModal)
