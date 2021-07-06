import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'

import { WHITE, ICE_BLUE } from 'shared/constants/colors'
import screens from 'constants/screens'
import navigationService from 'shared/navigation/service'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import SectionList from 'shared/components/sections/SectionList'
import { cutString } from 'shared/utils/stringUtils'

@withMappedNavigationParams()
class WorkOrdersList extends Component {

  renderTitle = () => {
    const { projectId, user } = this.props
    const projectInfo = _.get(user, ['projects', projectId, 'projectInfo'])
    return (
      <TitleWithDesc
        title='Project work orders'
        desc={_.get(projectInfo, 'address.name')}
      />
    )
  }

  toWorkOrder = workOrderId => () => {
    navigationService.push(screens.VIEW_WORK_ORDER, {workOrderId})
  }

  sections = () => {
    const { workOrders } = this.props
    return [
      {
        title: 'Work orders',
        data: _.map(workOrders, wo => ({
          key: wo.id,
          title: _.get(wo, 'label', ''),
          desc: cutString(_.get(wo, 'desc', ''), 40),
          onPress: this.toWorkOrder(wo.id)
        }))
      }
    ]
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={ICE_BLUE}
      >
        <NavBar
          leftButton={<BackButton />}
          title={this.renderTitle()}
          hideBorder
          backgroundColor={WHITE}
        />
        <SectionList
          sections={this.sections()}
        />
      </Page>
    )
  }
}

WorkOrdersList.propTypes = {
  projectId: PropTypes.string
}

const mapStateToProps = state => ({
  workOrders: state.workOrders,
  viewport: state.viewport,
  user: state.user
})

export default connect(mapStateToProps)(WorkOrdersList)
