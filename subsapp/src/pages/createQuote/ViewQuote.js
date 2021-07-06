import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import ElevatedView from 'react-native-elevated-view'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import { StyledText } from 'shared/components/StyledComponents'
import { AQUA_MARINE, PALE_GREY, WHITE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import ImageGallery from 'components/ImageGallery'
import TwoButtons from 'shared/components/buttons/TwoButtons'
import { sendBid } from 'controllers/workOrder'

const ContentContainer = styled(View)`
  width: 100%;
  padding-horizontal: ${props => getWidth(15, props.viewport)};
`
const EstimatePreview = styled(ElevatedView)`
  margin-top: ${props => getHeight(60, props.viewport)};
  height: ${props => getHeight(360, props.viewport)};
  width: 100%;
  background-color: ${WHITE};
  align-self: center;
`
const ButtonsContainer = styled(View)`
  margin-horizontal: ${props => getWidth(15, props.viewport)};
`

@withMappedNavigationParams()
class ViewQuote extends Component {


  goBack = () => navigationService.goBack()

  toggleMenu = () => console.log('toggle menu')

  sendBid = () => {
    const { bid, dispatch } = this.props
    console.log('send Bid', bid)
    dispatch(sendBid(bid))
  }

  render () {
    const { viewport, bid } = this.props
    const images = _.values(_.get(bid, 'files', {}))
    console.log('images', images)
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{title: 'Review quote'}}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Edit',
            handler: this.goBack
          }}
        />
        <ContentContainer viewport={viewport}>
          <EstimatePreview
            viewport={viewport}
            elevation={3}
          >
            <StyledText color={PALE_GREY}>Estimate</StyledText>
          </EstimatePreview>
        </ContentContainer>
        <ImageGallery
          viewport={viewport}
          images={images}
        />
        <TwoButtons
          viewport={viewport}
          leftButtonTitle='More'
          leftButtonOnPress={this.toggleMenu}
          rightButtonTitle='Send'
          rightButtonOnPress={this.sendBid}
          containerCustomStyle={`margin-horizontal: ${getWidth(15, viewport)}`}
        />
      </Page>
    )
  }

}

ViewQuote.propTypes = {
  bid: PropTypes.object
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(ViewQuote)
