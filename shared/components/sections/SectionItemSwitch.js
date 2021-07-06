import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { StyledSwitch } from 'shared/components/StyledComponents'

class SectionItemSwitch extends Component {
  onContainerClick = () => {
    const { onChange } = this.props
    onChange()
  }

  render () {
    const { viewport, trackColor, checked, onChange, ...rest } = this.props
    return (
      <StyledSwitch
        viewport={viewport}
        value={checked}
        onValueChange={onChange}
        trackColor={trackColor}
        {...rest}
      />
    )
  }
}

SectionItemSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  trackColor: PropTypes.string,
  disabled: PropTypes.bool
}

export default connect(state => ({ viewport: state.viewport }), null, null, { forwardRef: true })(SectionItemSwitch)

