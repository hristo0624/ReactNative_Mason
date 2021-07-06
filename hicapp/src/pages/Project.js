import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import PlusButton from 'shared/components/navbar/PlusButton'
import { AQUA_MARINE, LIGHT_NAVY, NICE_BLUE, LIGHT_NAVY40, WHITE, PALE_GREY, BLACK70 } from 'shared/constants/colors'
import { fontSize, getHeight, getWidth } from 'shared/utils/dynamicSize'
import { fetchProject } from 'controllers/project'
import { StyledText, Badge } from 'shared/components/StyledComponents'
import Tabs from 'shared/components/Tabs'
import SectionList from 'shared/components/sections/SectionList'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import ProjectActions, { actions } from 'components/panels/ProjectActions'
import EmptyState from 'shared/pages/EmptyState'
import createGroupImage from 'assets/images/create-group.png'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { getWorkOrdersForCurrentProject } from 'model/selectors/workOrdersSelector'
import ProjectPageTitle from 'pages/project/ProjectPageTitle'
import { cutString } from 'shared/utils/stringUtils'
import WorkOrderRow from 'pages/project/WorkOrderRow'

import PrivateChatPanel from 'components/panels/PrivateChatPanel'
import { isIos, majorVersionIOS } from 'constants/index'
import { SafeAreaView } from 'react-navigation'

const showSafeArea = isIos && majorVersionIOS >= 11

const PrivateContentWrapper = styled.View`
  flex: 1;
  background-color: ${BLACK70};
`
const FixBottomSafeArea = styled(View)`
  background-color: ${props => props.backgroundColor};
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 40;
  z-index: -1000;
`

const PRIVATE_CHAT_MODE = 'PRIVATE_CHAT_MODE'
const WORK_ORDERS_MODE = 'WORK_ORDERS_MODE'

@withMappedNavigationParams()
class Project extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: WORK_ORDERS_MODE,
      actionsModalVisible: false
    }

    props.dispatch(fetchProject(props.projectId))
  }

  toggleAddressModal = () => this.setState({ addressModalVisible: !this.state.addressModalVisible })
  toggleActionsModal = () => this.setState({ actionsModalVisible: !this.state.actionsModalVisible })

  loadProject = (projectId) => {
    const { dispatch, project } = this.props
    if (!_.isNil(projectId) && project.id !== projectId) {
      dispatch(fetchProject(projectId))
    }
  }

  changeMode = (m) => this.setState({ mode: m })

  renderTextWithBadge = (title, count, active) => {
    const { viewport } = this.props
    return (
      <React.Fragment>
        <StyledText color={active ? LIGHT_NAVY : LIGHT_NAVY40}>
          {title}
        </StyledText>
        <Badge
          size={fontSize(16, viewport)}
          customStyle={`
            background-color: ${AQUA_MARINE};
            opacity: ${active ? 1 : 0.66};
            margin-left: ${fontSize(5, viewport)}
          `}
        >
          <StyledText fontSize={12} color={WHITE}>{count}</StyledText>
        </Badge>
      </React.Fragment>
    )
  }

  renderTabs = () => {
    const { viewport, workOrders, unread, projectId, user } = this.props
    const { mode } = this.state
    const privUnreads = _.get(unread, [projectId, 'private'], {})
    let privUnreadNum = 0
    for (let pid in privUnreads) {
      if (pid === user.id) {
        privUnreadNum = privUnreads[pid]
      }
    }
    return (
      <Tabs
        items={[
          {
            label: this.renderTextWithBadge('Work orders', _.size(workOrders), mode === WORK_ORDERS_MODE),
            id: WORK_ORDERS_MODE
          },
          {
            label: this.renderTextWithBadge('Private chat', privUnreadNum, mode === PRIVATE_CHAT_MODE), // TODO: add amount of unread messages
            id: PRIVATE_CHAT_MODE
          }
        ]}
        onSelect={this.changeMode}
        selectedId={mode}
        indicatorColor={NICE_BLUE}
        height={getHeight(50, viewport)}
        containerCustomStyle={`background-color: ${WHITE}`}
      />
    )
  }

  onCreateChangeOrder = () => {
    console.log('on create chnage order')
  }

  toCreateWorkOrder = () => navigationService.push(screens.CREATE_WORK_ORDER)

  onAction = (action) => {
    console.log('onAction', action)
    switch (action) {
      case (actions.CREATE_PROPOSAL):
        navigationService.push(screens.CREATE_PROPOSAL)
        break
      case (actions.ADD_WORK_ORDER):
        this.toCreateWorkOrder()
        break
    }
  }

  renderActionsModal = () => {
    const { actionsModalVisible } = this.state
    return (
      <ProjectActions
        visible={actionsModalVisible}
        onClose={this.toggleActionsModal}
        onSelect={this.onAction}
      />
    )
  }

  renderWorkOrdersEmptyState = () => {
    const { viewport } = this.props
    return (
      <EmptyState
        title='No work orders'
        imageSource={createGroupImage}
        description='Create work orders and invite subcontractors to get work on the project started.'
        imageCustomStyle={`width: ${fontSize(140, viewport)}; height: ${fontSize(140, viewport)};`}
      >
        <PrimaryButton
          title='Create work order'
          onPress={this.toCreateWorkOrder}
          color={AQUA_MARINE}
          customStyle={`
            border-radius: ${fontSize(24, viewport)};
            width: ${getWidth(300, viewport)};
            margin-top: ${getHeight(30, viewport)};
          `}
        />
      </EmptyState>

    )
  }

  toWorkOrderInvites = (wo) => () => {
    const options = {
      projectId: wo.projectId,
      workOrderId: wo.id
    }
    navigationService.push(screens.WORK_ORDER_INVITES, options)
  }

  renderWorkOrders = () => {
    const { viewport, workOrders } = this.props
    if (_.isEmpty(workOrders) || _.isNil(workOrders)) {
      return this.renderWorkOrdersEmptyState()
    } else {
      return (
        <SectionList
          sections={[
            {
              key: 0,
              customHeader: (
                <StyledText
                  fontSize={20}
                  color={LIGHT_NAVY}
                  customStyle={`
                    margin-horizontal: ${getWidth(10, viewport)};
                    margin-vertical: ${getHeight(10, viewport)}
                  `}
                >
                  Work orders
                </StyledText>
              ),
              data: _.map(workOrders, wo => (
                {
                  key: wo.id,
                  customContent: (
                    <WorkOrderRow
                      key={wo.id}
                      workOrder={wo}
                      viewport={viewport}
                    />
                  ),
                  onPress: this.toWorkOrderInvites(wo)
                }
              ))

            }
          ]}
        />
      )
    }
  }

  renderPrivateChat = () => {
    const { viewport } = this.props
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <PrivateContentWrapper viewport={viewport}>

          <PrivateChatPanel />

        </PrivateContentWrapper>
        { showSafeArea ? <FixBottomSafeArea backgroundColor={WHITE} /> : null }
      </SafeAreaView>
    )
  }

  renderContent = () => {
    const { mode } = this.state
    switch (mode) {
      case PRIVATE_CHAT_MODE:
        return this.renderPrivateChat()
      case WORK_ORDERS_MODE:
        return this.renderWorkOrders()
    }
  }

  onTitlePress = () => {
    navigationService.push(screens.PROJECT_INFO)
  }

  renderLeftButton = () => {
    const { viewport, project } = this.props
    const address = cutString(_.get(project, 'address.name', ''), 20)
    return (
      <ProjectPageTitle
        viewport={viewport}
        title={address}
        onPress={this.onTitlePress}
      />
    )
  }

  render () {
    return (
      <Page
        statusBarColor={'white'}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          leftButton={this.renderLeftButton()}
          rightButton={<PlusButton color={AQUA_MARINE} onPress={this.toggleActionsModal} />}
          backgroundColor={WHITE}
        />
        {this.renderTabs()}
        {this.renderContent()}
        {this.renderActionsModal()}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user,
  account: state.account,
  project: state.project,
  workOrders: getWorkOrdersForCurrentProject(state),
  unread: state.unread
})

export default connect(mapStateToProps)(Project)
