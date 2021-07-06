import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Page, Card, ResourceList, FilterType, Stack, TextStyle, EmptyState } from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import history from 'src/history'
import wholesale from 'assets/icons/wholesale.svg'
import folderPlus from 'assets/icons/folder-plus.svg'
import exchange from 'assets/icons/exchange.svg'
import LoadingPage from 'components/pageStructure/LoadingPage'
import { moneyWithSymbolAbbr } from 'shared/utils/money'

class Projects extends Component {
  constructor (props) {
    super(props)
    this.state = {
      projectsData: null,
      searchValue: '',
      appliedFilters: []
    }
  }

  static getDerivedStateFromProps (props, state) {
    const { account } = props
    if (account !== state.account) {
      let projectsData = null
      if (account) projectsData = _.values(_.get(account, 'projectsInfo', {}))
      return {
        account,
        projectsData
      }
    } else {
      return null
    }
  }

  applyFilter = (filter, project) => {
    return (_.get(project, filter.key) === filter.value)
  }

  applyFilters = (filters) => {
  }

  handleSearchChange = searchValue => {
    this.setState({ searchValue })
  }

  handleFiltersChange = appliedFilters => {
    this.setState({ appliedFilters })
    // this.setState({
    //   projectsData: this.applyFilters(appliedFilters)
    // })
  }

  renderItem = item => {
    const { id, owner, address, description, projectCost } = item

    return (
      <ResourceList.Item id={id}>
        <Stack distribution='fillEvenly'>
          <h3>
            <TextStyle variation='strong'>{`${_.get(owner, 'firstName', '')} ${_.get(owner, 'lastName', '')}`}</TextStyle>
          </h3>
          <div>{_.get(address, 'description', '')}</div>
          <div>{description}</div>
          <div>{'Work started'}</div>
          <div>{moneyWithSymbolAbbr(projectCost, '$')}</div>
        </Stack>
      </ResourceList.Item>
    )
  }

  renderProjectsList () {
    const { projectsData } = this.state
    const resourceName = {
      singular: 'project',
      plural: 'projects'
    }
    const filters = [
      {
        key: 'status',
        label: 'Status',
        operatorText: 'is',
        type: FilterType.Select,
        options: ['Work started', 'Work finished']
      }
    ]

    const filterControl = (
      <ResourceList.FilterControl
        filters={filters}
        appliedFilters={this.state.appliedFilters}
        onFiltersChange={this.handleFiltersChange}
        searchValue={this.state.searchValue}
        onSearchChange={this.handleSearchChange}
      />
    )
    return (
      <Card>
        <ResourceList
          resourceName={resourceName}
          items={projectsData}
          renderItem={this.renderItem}
          filterControl={filterControl}
        />
      </Card>
    )
  }

  toCreateProposal = () => {
    history.push('/proposal/create')
  }

  renderEmptyState = () => {
    return (
      <PageLayout>
        <EmptyState
          heading='There is no projects yet'
          action={{ content: 'Create proposal', onAction: this.toCreateProposal }}
          image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
        >
          <p>A project appears here when documents are signed. Start from creating a proposal.</p>
        </EmptyState>
      </PageLayout>
    )
  }

  toCreateWorkOrder = () => {
    history.push('/workOrder/create')
  }

  renderProjects () {
    const { match } = this.props
    const { projectType } = match.params
    console.log('projectType', projectType)
    const title = projectType === 'active' ? 'Active Projects' : 'Completed Projects'
    return (
      <PageLayout>
        <Page
          separator
          fullWidth
          title={title}
          secondaryActions={[
            { content: 'Create project', icon: wholesale },
            { content: 'Add subcontractor', icon: folderPlus },
            {
              content: 'Add work order',
              icon: exchange,
              onAction: this.toCreateWorkOrder
            },
            {
              content: 'More actions',
              icon: 'caretDown'
            }
          ]}
          primaryAction={{ content: 'Create proposal', onAction: this.toCreateProposal }}
        >
          {this.renderProjectsList()}
        </Page>
      </PageLayout>
    )
  }

  render = () => {
    const { projectsData } = this.state
    if (_.isNil(projectsData)) {
      return (
        <PageLayout>
          <LoadingPage />
        </PageLayout>
      )
    } else if (projectsData.length === 0) {
      return this.renderEmptyState()
    } else {
      return this.renderProjects()
    }
  }
}

Projects.defaultProps = {
  projects: {}
}
const mapStateToProps = state => ({
  user: state.user,
  account: state.account
})

export default connect(mapStateToProps)(Projects)
