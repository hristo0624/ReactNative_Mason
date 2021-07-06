import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import styled from 'styled-components'
import { View, Image, FlatList } from 'react-native'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import SettingsButton from 'shared/components/navbar/SettingsButton'
import PlusButton from 'shared/components/navbar/PlusButton'
import navigationService from 'shared/navigation/service'
import { getHeight, fontSize, getWidth } from 'shared/utils/dynamicSize'
import ChevronDown from 'shared/icons/ChevronDown'
import PlainButton from 'shared/components/buttons/PlainButton'

import { AQUA_MARINE, WHITE, ICE_BLUE, LIGHT_NAVY } from 'shared/constants/colors'
import screens from 'constants/screens'
import iconLogo from 'assets/images/logo.png'
import ProjectInfoItem from 'pages/home/ProjectInfoItem'
import { fetchChatUserProfiles } from 'controllers/chat'

const TitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${props => getHeight(40, props.viewport)};
`
const LogoImage = styled(Image)`
  height: ${props => fontSize(20, props.viewport)};
`

class Home extends Component {

  onSearchChange = searchValue => {
    this.setState({ searchValue })
  }

  toSettings = () => navigationService.push(screens.SETTINGS)

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

  toChat = project => () => {
    const options = {
      projectId: project.id
    }
    this.props.dispatch(fetchChatUserProfiles(project.id))
    navigationService.push(screens.CHAT, options)
  }

  renderProject = (row) => {
    const { viewport } = this.props
    return (
      <ProjectInfoItem
        project={row.item}
        viewport={viewport}
        index={row.index}
        onPress={this.toChat(row.item)}
      />
    )
  }

  renderProjectsHeader = () => {
    const { viewport } = this.props
    const postfix = <ChevronDown size={10} color={LIGHT_NAVY} />
    return (
      <PlainButton
        title={'Current projects'}
        postfix={postfix}
        onPress={this.toggleChangeModePanel}
        fontSize={20}
        customStyle={`align-self: flex-start; margin-left: ${getWidth(10, viewport)}`}
      />
    )
  }

  renderProjects () {
    const { user } = this.props
    const projects = _.get(user, 'projects', {})
    console.log('user projects', projects)
    return (
      <FlatList
        // ListHeaderComponent={this.renderProjectsHeader()}
        keyExtractor={(project, index) => project.id}
        data={_.values(projects)}
        renderItem={this.renderProject}
      />
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
          leftButton={<SettingsButton color={AQUA_MARINE} onPress={this.toSettings} />}
          rightButton={<PlusButton color={AQUA_MARINE} />}
          title={this.renderTitle()}
          hideBorder
          backgroundColor={WHITE}
        />
        {this.renderProjectsHeader()}
        {this.renderProjects()}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user
})

export default connect(mapStateToProps)(Home)
