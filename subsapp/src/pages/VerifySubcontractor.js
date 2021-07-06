import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { View } from 'react-native'
import _ from 'lodash'

import navigationService from 'shared/navigation/service'

import { ref, auth } from 'constants/firebase'
import screens from 'constants/screens'
import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { WHITE, AQUA_MARINE } from 'shared/constants/colors'
import Search from 'shared/components/inputs/Search'
import { getHeight, getWidth } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import { signOut, getSubcontracts } from 'controllers/auth'

const MAX_LENGTH = 100
const MIN_SEARCH_LENGTH = 2

const PageContainer = styled.View`
  flex: 1;
  marginHorizontal: 10;
  justify-content: flex-start;
  margin-top: 15%;
`

const ButtonContainer = styled.View`
  width: 100%;
  justify-content: center;
  margin-top: ${props => getWidth(30, props.viewport)};
  margin-bottom: ${props => getWidth(30, props.viewport)};
  padding-left: ${props => getWidth(30, props.viewport)};
  padding-right: ${props => getWidth(30, props.viewport)};
`

class VerifySubcontractor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      loading: false,
      selectedItem: {},
      searchSubcontractor: []
    }
    this.search = _.debounce(this.search, 500)
  }

  onSearchChange = (v) => {
    this.setState({ searchString: v.substring(0, MAX_LENGTH) })
    this.search(v)
  }

  search = async (text) => {
    if (text.length >= MIN_SEARCH_LENGTH) {
      this.setState({ loading: true })
      const res = await getSubcontracts(text)
      const result = this.renderCluesSubcontract(res)
      this.setState({ searchSubcontractor: result, loading: false })
    } else {
      this.setState({ searchSubcontractor: [], loading: false })
    }
  }

  renderCluesSubcontract = (array) => {
    const { viewport } = this.props
    if (array.length) {
      return array.slice(0, 15).map((item, index) => {
        const title = this.getTextForSearchResult(item)
        return {
          key: index,
          desc: title,
          onPress: () => this.onPressSearchResult(title, item),
          containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
        }
      })
    } else {
      return [{
        key: 'no_result',
        desc: 'Not found results',
        containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
      }]
    }
  }

  sections = () => {
    const { searchSubcontractor } = this.state
    return [
      {
        data: [
          ...searchSubcontractor
        ]
      }
    ]
  }

  renderSearchComponent = () => {
    const { searchString, loading } = this.state
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Search
          value={searchString}
          onChangeText={this.onSearchChange}
          placeholder='Lookup by name, business or license #'
          loading={loading}
        />
      </View>
    )
  }

  renderSearchList = () => {
    const { searchSubcontractor } = this.state
    return searchSubcontractor.length ? (
      <View style={{ flex: 2 }}>
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
          noHeader
        />
      </View>) : null
  }

  handlerPressNext = () => {
    const { selectedItem } = this.state
    const license = selectedItem.license
    const userId = auth.currentUser.uid
    ref.child(`users/${userId}/profile/license`).set(license)
    navigationService.navigate(screens.HOME)
  }

  renderButton = () => {
    const { viewport } = this.props
    const { selectedItem, searchString } = this.state
    const isDisabled = this.getTextForSearchResult(selectedItem) === searchString
    return (
      <ButtonContainer viewport={viewport}>
        <PrimaryButton
          title='Next'
          customStyle={`margin-vertical: ${getHeight(35, viewport)}`}
          disabled={!isDisabled}
          onPress={this.handlerPressNext}
        />
      </ButtonContainer>
    )
  }

  onPressSearchResult = (searchString, selectedItem) => this.setState({ searchString, selectedItem, searchSubcontractor: [] })

  getTextForSearchResult = item => {
    if (item.license) {
      return `${item.name || item.business} (license #${item.license})`
    } else return null
  }

  handlerSkip = () => navigationService.navigate(screens.HOME)

  handlerBack = () => signOut()

  render () {
    const { viewport } = this.props
    return (
      <Page
        statusBarColor={AQUA_MARINE}
        statusBarStyle='light-content'
        backgroundColor={AQUA_MARINE}
      >
        <NavBar
          backgroundColor={AQUA_MARINE}
          title={{ title: '' }}
          leftButton={<BackButton color={WHITE} onPress={this.handlerBack} />}
          rightButton={{
            tintColor: WHITE,
            title: 'Skip',
            handler: this.handlerSkip
          }}
        />
        <PageContainer>
          <StyledText
            fontSize={20}
            color={WHITE}
            textAlign='center'
            letterSpacing={0.05}
            style={{ marginBottom: getHeight(20, viewport) }}
          >Validate your license</StyledText>
          <StyledText
            fontSize={16}
            color={WHITE}
            textAlign='center'
            letterSpacing={0.05}
            style={{ marginBottom: getHeight(30, viewport) }}
          >Search for your active contractor license below</StyledText>
          {this.renderSearchComponent()}
          {this.renderSearchList()}
          {this.renderButton()}
        </PageContainer>
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(VerifySubcontractor)
