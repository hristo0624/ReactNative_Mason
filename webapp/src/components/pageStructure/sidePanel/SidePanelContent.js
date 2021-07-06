import React from 'react'
import PropTypes from 'prop-types'
// import _ from 'lodash'

const SidePanelContent = ({ params, togglePanel }) => {
  // const panelType = _.get(params, 'panelType')
  // let PanelComp
  // switch (panelType) {
  //   case DOC_PANEL:
  //     PanelComp = DocPanel
  //     break
  //   case PROJECT_PANEL:
  //     PanelComp = ProjectPanel
  //     break
  // }
  // if (PanelComp) {
  //   return <PanelComp togglePanel={togglePanel} {...params} />
  // } else {
  //   return <div />
  // }
  return <div />
}

SidePanelContent.propTypes = {
  params: PropTypes.object,
  togglePanel: PropTypes.func
}

export default SidePanelContent
