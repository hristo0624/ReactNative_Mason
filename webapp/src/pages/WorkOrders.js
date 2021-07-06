import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Page, Card, ResourceList, FilterType, Stack, TextStyle } from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import history from 'src/history'
import wholesale from 'assets/icons/wholesale.svg'
import folderPlus from 'assets/icons/folder-plus.svg'
import exchange from 'assets/icons/exchange.svg'

class WorkOrders extends Component {
  state = {
    projectsData: [],
    searchValue: '',
    appliedFilters: []
  }

  static getDerivedStateFromProps (props, state) {
    const { projects } = props
    if (projects !== state.projects) {
      return {
        projects,
        projectsData: _.values(projects)
      }
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

  toWorkOrder = id => () => {
    history.push(`/workOrder/${id}`)
  }

  renderItem = item => {
    const { id, owner, address, description, status, sum } = item

    return (
      <ResourceList.Item
        id={id}
        onClick={this.toWorkOrder(id)}>
        <Stack distribution='fillEvenly'>
          <h3>
            <TextStyle variation='strong'>{owner}</TextStyle>
          </h3>
          <div>{address}</div>
          <div>{description}</div>
          <div>{status}</div>
          <div>{sum}</div>
        </Stack>
      </ResourceList.Item>
    )
  }

  renderContent () {
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

  toCreateWorkOrder = () => {
    history.push('/workOrder/create')
  }

  render () {
    const { match } = this.props
    const { projectType } = match.params
    console.log('projectType', projectType)
    const title = 'Work orders'
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
        >
          {this.renderContent()}
        </Page>
      </PageLayout>
    )
  }
}

WorkOrders.defaultProps = {
  projects: {
    'p1': {
      id: 'p1',
      owner: 'Bill Owner',
      address: '1323 Main Street Birmingham, AL…',
      description: 'Kitchen remodel, Roofing, Flooring',
      projectManager: 'Project manager',
      salesPerson: 'Sales person',
      status: 'Work started',
      sum: '$25000 contract'
    },
    'p2': {
      id: 'p2',
      owner: 'Jack Homeowner',
      address: '1323 Main Street Birmingham, AL…',
      description: 'Kitchen remodel, Roofing, Flooring',
      projectManager: 'Project manager',
      salesPerson: 'Sales person',
      status: 'Work started',
      sum: '$25000 contract'
    },
    'p3': {
      id: 'p3',
      owner: 'Homeowner name',
      address: '1323 Main Street Birmingham, AL…',
      description: 'Kitchen remodel, Roofing, Flooring',
      projectManager: 'Project manager',
      salesPerson: 'Sales person',
      status: 'Work finished',
      sum: '$25000 contract'
    }
  }
}
const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(WorkOrders)
