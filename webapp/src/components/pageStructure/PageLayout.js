import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Frame, Loading } from '@shopify/polaris'

import LoadingPage from 'components/pageStructure/LoadingPage'
import TopBar from 'components/pageStructure/TopBar'
import Menu from 'components/pageStructure/Menu'
import SidePanelContext from 'components/pageStructure/sidePanel/SidePanelContext'
import CreateSidePanel from 'components/pageStructure/sidePanel/CreateSidePanel'
import SidePanelContent from 'components/pageStructure/sidePanel/SidePanelContent'

class PageLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showMobileNavigation: false,
      isOpen: false,
      params: null
    }
  }

  toggleMobileNavigation = () => {
    this.setState({ showMobileNavigation: !this.state.showMobileNavigation })
  }

  togglePanel = params => () => {
    this.setState({
      isOpen: !this.state.isOpen,
      params
    })
  }

  renderSidePanelContent () {
    const { params } = this.state
    return <SidePanelContent params={params} togglePanel={this.togglePanel(params)} />
  }

  render () {
    const { showMobileNavigation, isOpen, params } = this.state
    const { isLoading } = this.props
    return (
      <CreateSidePanel
        isOpen={isOpen}
        togglePanel={this.togglePanel(params)}
        params={params}
        sidePanelContent={this.renderSidePanelContent()}
      >
        <SidePanelContext.Provider value={this.togglePanel}>
          <Frame
            topBar={<TopBar toggleMobileNavigation={this.toggleMobileNavigation} />}
            navigation={<Menu toggleMobileNavigation={this.toggleMobileNavigation} />}
            showMobileNavigation={showMobileNavigation}
            onNavigationDismiss={this.toggleMobileNavigation}
          >
            {isLoading ? <Loading /> : null}
            {isLoading ? <LoadingPage /> : this.props.children}
          </Frame>
        </SidePanelContext.Provider>
      </CreateSidePanel>
    )
  }
}

PageLayout.defaultProps = {
  isLoading: false
}

PageLayout.propTypes = {
  isLoading: PropTypes.bool
}

export default PageLayout
