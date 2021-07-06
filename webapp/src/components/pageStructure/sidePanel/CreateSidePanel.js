import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Sidebar from 'react-sidebar'
import _ from 'lodash'

import { OVERLAY_BACKGROUND } from 'constants/colors'

class CreateSidePanel extends Component {
  render () {
    const { isOpen, togglePanel, sidePanelContent } = this.props
    const styles = {
      sidebar: {
        top: '5.6rem',
        background: 'white',
        zIndex: 12
      },
      overlay: {
        zIndex: 11,
        backgroundColor: OVERLAY_BACKGROUND
      }
    }
    return (
      <Sidebar
        sidebar={sidePanelContent}
        open={isOpen}
        onSetOpen={togglePanel}
        styles={styles}
        pullRight
      >
        {this.props.children}
      </Sidebar>
    )
  }
}

CreateSidePanel.propTypes = {
  isOpen: PropTypes.bool,
  togglePanel: PropTypes.func,
  params: PropTypes.object,
  sidePanelContent: PropTypes.element
}

export default CreateSidePanel
