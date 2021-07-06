import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import styled from 'styled-components'
import { View, ScrollView, Text } from 'react-native'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'

import screens from 'constants/screens'
import navigationService from 'shared/navigation/service'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import { cutString } from 'shared/utils/stringUtils'
import { WHITE, BLACK10, LIGHT_NAVY, DARK, DEEP_SKY_BLUE, BLUEY_GREY, ICE_BLUE } from 'shared/constants/colors'
import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import PlainButton from 'shared/components/buttons/PlainButton'
import MapModal from 'shared/components/modals/MapModal'
import TwoButtons from 'shared/components/buttons/TwoButtons'
import ViewWorkOrderMenu, { actions } from 'pages/chat/ViewWorkOrderMenu'
import ImageGallery from 'components/ImageGallery'

const DESC_LENGTH = 100

const ContentContainer = styled(ScrollView)`
  padding-horizontal: ${props => getWidth(20, props.viewport)};
  padding-vertical: ${props => getHeight(20, props.viewport)};
`
const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1;
  border-bottom-color: ${BLACK10};
  align-items: center;
  padding-vertical: ${props => getHeight(10, props.viewport)};
`
const DescriptionContainer = styled(View)`
  flex-direction: column;
  border-bottom-width: 1;
  border-bottom-color: ${BLACK10};
  padding-vertical: ${props => getHeight(10, props.viewport)};
`
const WorkOrderImages = styled(ImageGallery)`
  padding-vertical: ${props => getHeight(10, props.viewport)};
`

@withMappedNavigationParams()
class ViewWorkOrder extends Component {
  constructor (props) {
    super(props)
    const workOrder = _.get(props, ['workOrders', props.workOrderId])
    const images = _.values(_.get(workOrder, 'files', {}))
    const desc = _.get(workOrder, 'desc', '')
    this.state = {
      workOrder,
      descShortMode: desc.length > DESC_LENGTH,
      menuVisible: false,
      images
    }
  }

  renderTitle = () => {
    const { workOrder } = this.state
    const title = _.get(workOrder, 'projectAddress.name', '')
    const desc = _.get(workOrder, 'companyName', '')
    return (
      <TitleWithDesc
        title={title}
        desc={desc}
      />
    )
  }

  renderRowTitle = (title) => (
    <StyledText
      fontSize={18}
      color={LIGHT_NAVY}
      bold
    >
      {title}
    </StyledText>
  )

  renderRowDesc = (desc) => (
    <StyledText
      fontSize={12}
      color={DARK}
    >
      {desc}
    </StyledText>
  )

  renderRowDescButton = (desc, onPress) => (
    <PlainButton
      fontSize={12}
      color={DEEP_SKY_BLUE}
      title={desc}
      onPress={onPress}
    />
  )

  toggleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible })
  }

  renderButtons = () => {
    const { viewport } = this.props
    return (
      <TwoButtons
        viewport={viewport}
        leftButtonTitle='More'
        leftButtonOnPress={this.toggleMenu}
        rightButtonTitle='Create quote'
        rightButtonOnPress={this.createQuote}
      />
    )
  }

  makeDescLong = () => this.setState({ descShortMode: false })

  toggleAddressModal = () => this.setState({ addressModalVisible: !this.state.addressModalVisible })

  renderMapModal = () => {
    const { addressModalVisible, workOrder } = this.state
    const address = _.get(workOrder, 'projectAddress.name', '')
    return (
      <MapModal
        key={_.get(workOrder, 'id', 'defaultKey')}
        visible={addressModalVisible}
        onClose={this.toggleAddressModal}
        address={address}
        location={_.get(workOrder, 'projectAddress.location')}
        placeId={_.get(workOrder, 'projectAddress.placeId')}
      />
    )
  }

  declineWorkOrder = () => {
    console.log('decline work order')
  }

  onMenuHide = () => {
    switch (this.lastMenuAction) {
      case actions.MAP:
        this.lastMenuAction = null
        this.toggleAddressModal()
        break
      case actions.CHAT:
        this.lastMenuAction = null
        navigationService.pop(2)
        break
      case actions.DECLINE_OFFER:
        this.lastMenuAction = null
        this.declineWorkOrder()
        break
    }
  }

  createQuote = () => {
    const { workOrderId } = this.props
    navigationService.push(screens.CREATE_QUOTE, { workOrderId })
  }

  onMenuAction = (action) => {
    console.log('on menu action', action)
    this.lastMenuAction = action
  }

  renderMenu = () => {
    const { menuVisible } = this.state
    return (
      <ViewWorkOrderMenu
        visible={menuVisible}
        onClose={this.toggleMenu}
        onSelect={this.onMenuAction}
        onModalHide={this.onMenuHide}
      />
    )
  }

  renderContent = () => {
    const { viewport } = this.props
    const { descShortMode, workOrder } = this.state
    const items = _.get(workOrder, 'items', [])
    const itemsNames = _.map(items, item => item.name).join(', ')
    let desc = _.get(workOrder, 'desc', '')
    if (descShortMode) desc = cutString(desc, DESC_LENGTH)
    return (
      <ContentContainer viewport={viewport}>
        <Row viewport={viewport}>
          {this.renderRowTitle('Contractor')}
          {this.renderRowDesc(_.get(workOrder, 'companyName', ''))}
        </Row>
        <Row viewport={viewport} >
          {this.renderRowTitle('Job Location')}
          {this.renderRowDescButton(_.get(workOrder, 'projectAddress.structured.secondary', ''), this.toggleAddressModal)}
        </Row>
        <Row viewport={viewport}>
          {this.renderRowTitle('Work Items')}
          {this.renderRowDesc(cutString(itemsNames, 30))}
        </Row>
        <DescriptionContainer viewport={viewport}>
          <StyledText
            fontSize={18}
            color={LIGHT_NAVY}
            bold
            customStyle={`margin-vertical: ${getHeight(20, viewport)}`}
          >
            Description of work
          </StyledText>
          <Text>
            <StyledText
              fontSize={12}
              color={DARK}
              customStyle={`margin-bottom: ${getHeight(10, viewport)}`}
            >
              {desc}
            </StyledText>
            {descShortMode
              ? <StyledText
                color={BLUEY_GREY}
                fontSize={12}
                customStyle={`margin-left: ${getWidth(10, viewport)}`}
                onPress={this.makeDescLong}
              >
                {`  more`}
              </StyledText>
              : null
            }
          </Text>
        </DescriptionContainer>
        <WorkOrderImages viewport={viewport} images={this.state.images} />
        {this.renderButtons()}
      </ContentContainer>
    )
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
        {this.renderContent()}
        {this.renderMapModal()}
        {this.renderMenu()}
      </Page>
    )
  }
}

ViewWorkOrder.propTypes = {
  workOrderId: PropTypes.string
}

const mapStateToProps = state => ({
  workOrders: state.workOrders,
  viewport: state.viewport,
  user: state.user
})

export default connect(mapStateToProps)(ViewWorkOrder)
