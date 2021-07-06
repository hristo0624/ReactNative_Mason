import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import { View } from 'react-native'
import _ from 'lodash'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, DUSK_TWO, DARK, BLACK70 } from 'shared/constants/colors'
import { fontSize, getHeight } from 'shared/utils/dynamicSize'
import { StyledText, StyledImage } from 'shared/components/StyledComponents'
import { getRolesTitles } from 'model/selectors/rolesSelectors'
import Chevron from 'shared/components/Chevron'
import PrivateChatPanel from 'components/panels/PrivateChatPanel'
import SlidingUpModal from 'shared/components/modals/SlidingUpModal'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import { SafeAreaView } from 'react-navigation'
import { isIos, majorVersionIOS, NAV_BAR_HEIGHT, ITALIC_FONT } from 'constants/index'
import EyeButton from 'shared/components/navbar/EyeButton'
import CloseButton from 'shared/components/navbar/CloseButton'

const SpacingView = styled.View`
  height: ${props => getHeight(6, props.viewport)}; 
`
const showSafeArea = isIos && majorVersionIOS >= 11

const ModalContentWrapper = styled.View`
  flex: 1;
  background-color: ${BLACK70};
`
const FixBottomSafeArea = styled(View)`
  background-color: ${props => props.backgroundColor};
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 80;
  z-index: -1000;
`

const ImageWithChevron = styled(View)`
  flex-direction: row;
  align-items: center;
`

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: ${props => fontSize(NAV_BAR_HEIGHT, props.viewport)};
`

@withMappedNavigationParams()
class WorkOrderInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      privateChatModalVisible: false
    }
  }

  emptyStateRow = title => {
    return {
      key: 0,
      notClickable: true,
      customContent: (
        <StyledText
          fontSize={14}
          color={DUSK_TWO}
          customStyle={'width: 100%; text-align: center;'}
        >
          {title}
        </StyledText>
      )
    }
  }

  pendingRequests = () => {
    // TODO: implement pending requests
    return [ this.emptyStateRow(' No requests') ]
  }

  changeOrders = () => {
    // TODO: implement change orders
    return [ this.emptyStateRow('No change orders') ]
  }

  completions = () => {
    // TODO: implement completions
    return [ this.emptyStateRow('No completion requests') ]
  }

  renderLineItems = () => {
    const { workOrders, workOrderId } = this.props
    const wo = _.get(workOrders, workOrderId)
    const lineItems = _.get(wo, 'items')
    if (_.isEmpty(lineItems)) {
      return [ this.emptyStateRow('empty') ]
    } else {
      return _.map(lineItems, (item, itemId) => {
        return {
          title: item.name,
          key: itemId,
          desc: item.desc,
          actionField: <View />,
          notClickable: true
        }
      })
    }
  }

  people = () => {
    const { project, account, user, rolesDict } = this.props
    const adminsDict = _.get(project, 'admins', {})
    if (!_.has(adminsDict, user.id)) adminsDict[user.id] = true
    return _.map(adminsDict, (v, uid) => {
      const roleId = _.get(account, ['admins', uid, 'role'])
      const roleTitle = _.get(rolesDict, roleId)
      return {
        title: _.get(account, ['admins', uid, 'name'], ''),
        desc: roleTitle,
        key: uid,
        notClickable: true,
        actionField: <View />
      }
    })
  }

  toPaymentsHistory = () => {}
  onAddChangeOrder = () => {}
  onAddCompletionRequest = () => {}

  renderMedia = () => {
    const { workOrders, workOrderId, viewport } = this.props
    const wo = _.get(workOrders, workOrderId)
    const files = _.get(wo, 'files', {})
    if (_.isEmpty(files)) {
      return []
    } else {
      return [
        {
          title: 'MEDIA',
          data: [
            {
              title: 'Images and videos',
              key: 'images and video',
              actionField: (
                <ImageWithChevron>
                  <StyledImage
                    size={fontSize(50, viewport)}
                    source={{ uri: _.get(_.values(files), [0, 'url']) }}
                    resizeMode='contain'
                    customStyle={'border-radius: 0;'}
                  />
                  <Chevron />
                </ImageWithChevron>
              )
            }
          ]
        }
      ]
    }
  }

  sections = () => {
    return [
      {
        title: 'Pending reqeusts',
        data: this.pendingRequests()
      },
      {
        title: 'Payments history',
        data: [{
          title: 'Payments history',
          desc: '$0 total for this work order', // TODO: calc total
          key: 0,
          onPress: this.toPaymentsHistory
        }]
      },
      {
        title: 'Private chat',
        data: [{
          title: 'Private chat without sub',
          key: 0,
          onPress: this.togglePrivateChatModal
        }]
      },
      {
        title: 'People',
        data: this.people()
      },
      {
        title: 'Change orders',
        data: [
          ...this.changeOrders(),
          {
            title: 'Add change order',
            key: 'new change order',
            onPress: this.onAddChangeOrder,
            addNewField: true
          }
        ]
      },
      {
        title: 'Completions',
        data: [
          ...this.completions(),
          {
            title: 'Add completion request',
            key: 'Add completion request ',
            onPress: this.onAddCompletionRequest,
            addNewField: true
          }
        ]
      },
      {
        title: 'Scope of work order',
        data: this.renderLineItems()
      },
      ...this.renderMedia()
    ]
  }

  // Toggle Private Chat Modal
  togglePrivateChatModal = () => this.setState({ privateChatModalVisible: !this.state.privateChatModalVisible })

  // Display normal part of work order info page
  renderSection = () => {
    return (
      <SectionList
        stickySectionHeadersEnabled={false}
        sections={this.sections()}
      />
    )
  }

  // Display Private Chat modal header
  renderPrivateModalTitle = () => {
    const { viewport } = this.props
    return (
      <TitleContainer viewport={viewport}>
        <TitleWithDesc
          title={'Private Chat'}
          desc={'Simon sub cannot see this message'}
          titleCustomStyle={`color: ${WHITE}`}
          descCustomStyle={`font-family: ${ITALIC_FONT}`}
        />
      </TitleContainer>
    )
  }

  // Display private chat
  renderPrivateChat = () => {
    const { viewport } = this.props
    const { privateChatModalVisible } = this.state

    return (
      <SlidingUpModal
        visible={privateChatModalVisible}
        viewport={viewport}
        title={'Private Chat'}
        // onClose={this.togglePrivateChatModal}
        showCross={false}
        percHeight={0.93}
        backColor={DARK}
      >
        <SafeAreaView forceInset={{ bottom: 'always' }} style={{ flex: 1 }}>
          <ModalContentWrapper viewport={viewport}>
            <NavBar
              backgroundColor={DARK}
              // title={'Project location'}
              leftButton={<CloseButton color={WHITE} onPressHandler={this.togglePrivateChatModal} />}
              title={this.renderPrivateModalTitle()}
              rightButton={<EyeButton />}
            />

            <PrivateChatPanel />
            <SpacingView viewport={viewport} />
          </ModalContentWrapper>
          { showSafeArea ? <FixBottomSafeArea backgroundColor={WHITE} /> : null }
        </SafeAreaView>
      </SlidingUpModal>

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
          title={{ title: 'Work order details' }}
          leftButton={<BackButton />}
        />
        {this.renderSection()}
        {this.renderPrivateChat()}
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  viewport: state.viewport,
  project: state.project,
  account: state.account,
  workOrders: state.workOrders,
  rolesDict: getRolesTitles(state)
})

export default connect(mapStateToProps)(WorkOrderInfo)
