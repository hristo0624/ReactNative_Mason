import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Image, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import SettingsButton from 'shared/components/navbar/SettingsButton'
import PlusButton from 'shared/components/navbar/PlusButton'
import { ICE_BLUE, AQUA_MARINE, PALE_GREY, LIGHT_NAVY, WHITE } from 'shared/constants/colors'
import { fontSize, getHeight, getWidth } from 'shared/utils/dynamicSize'
import Search from 'shared/components/inputs/Search'
import Loading from 'shared/pages/Loading'
import EmptyState from 'shared/pages/EmptyState'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import { getCreateProposalPermission } from 'model/selectors/permissionsSelector'
import ProjectsOrProposals, { PROJECTS, PROPOSALS } from 'components/panels/ProjectsOrProposals'
import PlainButton from 'shared/components/buttons/PlainButton'
import ChevronDown from 'shared/icons/ChevronDown'
import ProjectsFilterSelect, { filters } from 'components/panels/ProjectsFilterSelect'
import ProjectInfoItem from 'pages/projects/ProjectInfoItem'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import ProposalInfoItem from 'pages/projects/ProposalInfoItem'
import iconLogo from 'assets/images/logo.png'
import createGroupImage from 'assets/images/create-group.png'
import iconSearch from 'assets/images/search.png'
import { ACTIVE_OPACITY } from 'constants/index'

const MenuContainer = styled.View`
  width: ${props => props.viewport.width};
  height: ${props => getHeight(60, props.viewport)};
  background-color: ${PALE_GREY};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${props => getWidth(10, props.viewport)};
`
const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${props => getHeight(40, props.viewport)};
`
const LogoImage = styled(Image)`
  /* width: ${props => fontSize(25, props.viewport)}; */
  height: ${props => fontSize(20, props.viewport)};
`
const SearchButtonContainer = styled(TouchableOpacity)`
  position: absolute;
  bottom: ${props => getHeight(20, props.viewport)};
  right: ${props => getWidth(10, props.viewport)};
`
const SearchImage = styled(Image)`
  width: ${props => fontSize(60, props.viewport)};
  height: ${props => fontSize(60, props.viewport)};
`

class Projects extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      mode: PROJECTS,
      changeModePanelVisible: false,
      filter: filters.MOST_RECENT,
      searchFieldVisible: false,
      searchText: ''
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { account } = props
    if (account !== state.account) {
      const rawData = state.mode === PROJECTS ? _.get(account, 'projectsInfo', {}) : _.get(account, 'proposalsInfo', {})
      return {
        account,
        data: Projects.applyFilters(rawData, state.filter, state.searchText)
      }
    } else {
      return null
    }
  }

  static applyFilters = (data = {}, filter, searchString) => {
    const res = []
    // console.log('applyFilters, data', data, 'filter', filter, 'searchString', searchString)
    for (const id in data) {
      const info = data[id]
      let searchOk = false
      if (_.isNil(searchString) || _.isEmpty(searchString)) {
        searchOk = true
      } else {
        const reg = new RegExp(searchString, 'gi')
        searchOk = _.get(info, 'owner.firstName', '').match(reg) ||
                   _.get(info, 'owner.lastName', '').match(reg) ||
                   _.get(info, 'address.description', '').match(reg) ||
                   _.get(info, 'name', '').match(reg)
      }
      let filterOk = false
      switch (filter) {
        case filters.COMPLETED:
          filterOk = true
          break
        case filters.IN_PROGRESS:
          filterOk = false
          break
        default:
          filterOk = true
      }
      if (filterOk && searchOk) res.push(info)
    }
    // appplying sorting
    let sortedData = res
    switch (filter) {
      case filters.HIGHT_TO_LOW:
        sortedData = _.orderBy(res, ['projectCost'], ['desc'])
        break
      case filters.LOW_TO_HIGHT:
        sortedData = _.orderBy(res, ['projectCost'], ['asc'])
        break
      case filters.MOST_RECENT:
        sortedData = _.orderBy(res, ['createdAt'], ['desc'])
        break
      case filters.LEAST_RECENT:
        sortedData = _.orderBy(res, ['createdAt'], ['asc'])
        break
    }
    return sortedData
  }

  renderNavBarSearchField = () => {
    const { viewport } = this.props
    const { mode } = this.state
    return (
      <Search
        placeholder={mode === PROJECTS ? 'Search projects' : 'Search proposals'}
        type='dark'
        inputCustomStyle={`background-color: ${ICE_BLUE}; height: ${fontSize(32, viewport)};`}
        customStyle='width: 70%;'
      />
    )
  }

  toggleSearchField = () => {
    this.setState({
      searchFieldVisible: !this.state.searchFieldVisible,
      searchText: ''
    })
  }

  searchInputMounted = ref => {
    this.searchInputRef = ref
  }

  getRawData = (mode) => {
    const { account } = this.props
    return mode === PROJECTS ? _.get(account, 'projectsInfo', {}) : _.get(account, 'proposalsInfo', {})
  }

  onChangeSearch = (v) => {
    const { filter, mode } = this.state
    this.setState({
      searchText: v,
      data: Projects.applyFilters(this.getRawData(mode), filter, v)
    })
  }

  renderSearchField = () => {
    const { viewport } = this.props
    const { mode, searchFieldVisible, searchText } = this.state
    if (searchFieldVisible) {
      return (
        <Search
          autoFocus
          value={searchText}
          onChangeText={this.onChangeSearch}
          getRef={this.searchInputMounted}
          placeholder={mode === PROJECTS ? 'Search projects' : 'Search proposals'}
          type='dark'
          inputCustomStyle={`
            background-color: ${WHITE};
            height: ${fontSize(32, viewport)};
            border-width: 0;

          `}
          customStyle={`
            background-color: ${WHITE};
            margin-horizontal: ${getWidth(5, viewport)};
            margin-vertical: ${getHeight(2, viewport)};
            border-width: 1;
            border-color: ${PALE_GREY};
            border-radius: ${fontSize(5, viewport)};
          `}
          onReset={this.toggleSearchField}
        />
      )
    }
  }

  renderEmptyState = () => {
    const { viewport } = this.props
    const { mode, searchFieldVisible } = this.state
    if (searchFieldVisible) {
      return (
        <EmptyState
          description={'No results'}
        />
      )
    } else {
      let title = 'No projects'
      let description = 'A project appears here when documents are signed. Start from creating a proposal.'
      if (mode === PROPOSALS) {
        title = 'No proposals'
        description = 'Create your first proposal'
      }
      return (
        <EmptyState
          imageSource={createGroupImage}
          title={title}
          description={description}
        >
          <PrimaryButton
            title='Create proposal'
            onPress={this.toCreateProposal}
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
  }

  toggleChangeModePanel = () => this.setState({ changeModePanelVisible: !this.state.changeModePanelVisible })
  toggleFilterPanel = () => this.setState({ filterPanelVisible: !this.state.filterPanelVisible })

  renderMenu = () => {
    const { mode, filter } = this.state
    const { viewport } = this.props
    const postfix = <ChevronDown size={10} color={LIGHT_NAVY} />
    return (
      <MenuContainer viewport={viewport} >
        <PlainButton
          title={mode}
          postfix={postfix}
          onPress={this.toggleChangeModePanel}
          fontSize={20}
        />
        <PlainButton
          title={filter}
          postfix={postfix}
          onPress={this.toggleFilterPanel}
          fontSize={16}
        />
      </MenuContainer>
    )
  }

  renderItems = () => {
    const { mode, data } = this.state
    if (mode === PROJECTS) {
      if (_.isEmpty(data)) {
        return this.renderEmptyState()
      } else {
        return _.map(data, projectInfo => (
          <ProjectInfoItem
            projectInfo={projectInfo}
            key={projectInfo.id}
            onPress={this.openProject(projectInfo.id)}
          />
        ))
      }
    } else {
      if (_.isEmpty(data)) {
        return this.renderEmptyState()
      } else {
        return _.map(data, proposalInfo => (
          <ProposalInfoItem
            proposalInfo={proposalInfo}
            key={proposalInfo.id}
            onPress={this.openProposal(proposalInfo.id)}
          />
        ))
      }
    }
  }

  renderContent = () => {
    const { account } = this.state
    if (_.isNil(account)) {
      return (
        <Loading />
      )
    } else {
      return (
        <ScrollView>
          {this.renderItems()}
        </ScrollView>
      )
    }
  }

  toCreateProposal = () => navigationService.push(screens.CREATE_PROPOSAL)
  openProposal = id => () => navigationService.push(screens.CREATE_PROPOSAL, { parentProposalId: id })
  openProject = id => () => navigationService.push(screens.PROJECT, { projectId: id })
  toSettings = () => navigationService.push(screens.SETTINGS)

  handleChangeMode = (v) => {
    const { filter, searchText } = this.state
    this.setState({
      mode: v,
      data: Projects.applyFilters(this.getRawData(v), filter, searchText)
    })
  }
  handleChangeFilter = (v) => {
    const { mode, searchText } = this.state
    this.setState({
      filterPanelVisible: false,
      filter: v,
      data: Projects.applyFilters(this.getRawData(mode), v, searchText)
    })
  }

  renderChangeModePanel = () => {
    const { mode, changeModePanelVisible } = this.state
    return (
      <ProjectsOrProposals
        value={mode}
        visible={changeModePanelVisible}
        onSelect={this.handleChangeMode}
        onClose={this.toggleChangeModePanel}
      />
    )
  }

  renderFilterPanel = () => {
    const { filter, filterPanelVisible } = this.state
    return (
      <ProjectsFilterSelect
        value={filter}
        visible={filterPanelVisible}
        onSelect={this.handleChangeFilter}
        onClose={this.toggleFilterPanel}
      />
    )
  }

  renderTitle = () => {
    const { viewport } = this.props
    return (
      <TitleContainer viewport={viewport}>
        <LogoImage
          source={iconLogo}
          viewport={viewport}
        />
      </TitleContainer>
    )
  }

  renderSearchButton () {
    const { viewport } = this.props
    const { searchFieldVisible, data } = this.state
    if (!searchFieldVisible && !_.isEmpty(data)) {
      return (
        <SearchButtonContainer
          viewport={viewport}
          activeOpacity={ACTIVE_OPACITY}
          onPress={this.toggleSearchField}
        >
          <SearchImage
            viewport={viewport}
            source={iconSearch}
          />
        </SearchButtonContainer>
      )
    }
  }

  render () {
    const { canCreateProposal } = this.props
    return (
      <Page
        statusBarColor={'white'}
        statusBarStyle='dark-content'
      >
        <NavBar
          // title={this.renderNavBarSearchField()}
          // title={{title: 'sdfs'}}
          title={this.renderTitle()}
          leftButton={<SettingsButton color={AQUA_MARINE} onPress={this.toSettings} />}
          rightButton={canCreateProposal ? <PlusButton color={AQUA_MARINE} onPress={this.toCreateProposal} /> : null}
        />
        {this.renderMenu()}
        {this.renderSearchField()}
        {this.renderContent()}
        {this.renderChangeModePanel()}
        {this.renderFilterPanel()}
        {this.renderSearchButton()}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user,
  account: state.account,
  canCreateProposal: getCreateProposalPermission(state)
})

export default connect(mapStateToProps)(Projects)
