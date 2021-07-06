import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { View } from 'react-native'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, LIGHT_NAVY, LIGHT_GREY_BLUE } from 'shared/constants/colors'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import PlainButton from 'shared/components/buttons/PlainButton'
import { StyledText } from 'shared/components/StyledComponents'
import ChevronDown from 'shared/icons/ChevronDown'
import ModalSelect from 'shared/components/modals/ModalSelect'
import InvitedSub from 'pages/workOrderInvites/InvitedSub'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'

const DescContainer = styled(View)`
  align-items: center;
  background-color: ${WHITE};
  width: 100%;
  padding-horizontal: ${props => getWidth(20, props.viewport)};
  padding-vertical: ${props => getHeight(20, props.viewport)};
`

@withMappedNavigationParams()
class WorkOrderInvites extends Component {
  constructor (props) {
    super(props)
    // console.log('WorkOrderInvites constructor', props)
    this.state = {
      workOrderId: props.workOrderId,
      workOrderSelectorVisible: false
    }
  }

  renderWorkOrderDesc = () => {
    const { workOrders, viewport } = this.props
    const { workOrderId } = this.state
    const wo = workOrders[workOrderId]
    return (
      <DescContainer viewport={viewport}>
        <StyledText
          fontSize={13}
          color={LIGHT_GREY_BLUE}
          customStyle='text-align: center;'
        >
          {wo.desc}
        </StyledText>
      </DescContainer>
    )
  }

  renderSub = m => {
    const { viewport, messages, workOrders, typing } = this.props
    const { workOrderId } = this.state
    const wo = workOrders[workOrderId]
    const woSubsMessages = _.values(_.get(messages, [wo.projectId, m.id], {}))
    const sortedMessages = _.orderBy(woSubsMessages, ['timestamp'], ['desc'])
    // console.log('sorted messages', sortedMessages)
    const lastMessage = _.get(sortedMessages, [0, 'text'], '...')
    // console.log('last message', lastMessage)
    return (
      <InvitedSub
        viewport={viewport}
        subId={m.id}
        name={`${_.get(m, 'firstName', '')} ${_.get(m, 'lastName', '')}`}
        lastActivityTime={_.get(m, 'lastActivityTime', _.now())}
        lastMessage={lastMessage}
        typingTime={_.get(typing, [wo.projectId, m.id, m.id])}
      />
    )
  }

  toChat = subId => () => {
    const { workOrders } = this.props
    const { workOrderId } = this.state
    const wo = workOrders[workOrderId]
    const options = {
      projectId: wo.projectId,
      subId,
      workOrderId
    }
    navigationService.push(screens.CHAT, options)
  }

  sections = () => {
    const { workOrders } = this.props
    const { workOrderId } = this.state
    const wo = workOrders[workOrderId]
    const items = _.map(wo.members, m => ({
      title: '',
      key: m.id,
      customContent: this.renderSub(m),
      noMargin: true,
      onPress: this.toChat(m.id)
    }))
    return [
      {
        title: 'Invited subs',
        data: [
          ...items,
          {
            title: 'Invite subs',
            key: 'addPeople',
            onPress: this.onAddPeople,
            addNewField: true
          }
        ]
      }
    ]
  }

  selectWorkOrder = (woId) => this.setState({ workOrderId: woId })

  renderWorkOrderSelect = () => {
    const { workOrders, projectId } = this.props
    const { workOrderSelectorVisible, workOrderId } = this.state
    const items = []
    for (const woId in workOrders) {
      const wo = workOrders[woId]
      if (wo.projectId === projectId) {
        items.push({
          title: _.get(wo, 'label', '').substr(0, 35),
          id: _.get(wo, 'id')
        })
      }
    }
    return (
      <ModalSelect
        visible={workOrderSelectorVisible}
        onClose={this.toggleWorkOrderSelector}
        onSelect={this.selectWorkOrder}
        selectedId={workOrderId}
        items={items}
      />
    )
  }

  toggleWorkOrderSelector = () => this.setState({ workOrderSelectorVisible: !this.state.workOrderSelectorVisible })

  renderTitle = () => {
    const { workOrders, viewport } = this.props
    const { workOrderId } = this.state
    let title = _.get(workOrders, [ workOrderId, 'label' ], 'Untitled')
    if (title.length > 23) title = `${title.substr(0, 20)}...`
    return (
      <PlainButton
        title={title}
        customStyle={`height: ${getHeight(40, viewport)}`}
        postfix={<ChevronDown size={10} color={LIGHT_NAVY} />}
        onPress={this.toggleWorkOrderSelector}
      />
    )
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={this.renderTitle()}
          leftButton={<BackButton />}
        />
        {this.renderWorkOrderDesc()}
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderWorkOrderSelect()}
      </Page>
    )
  }
}

WorkOrderInvites.propTypes = {
  workOrderId: PropTypes.string,
  projectId: PropTypes.string
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  workOrders: state.workOrders,
  messages: state.messages,
  typing: state.typing
})

export default connect(mapStateToProps)(WorkOrderInvites)
