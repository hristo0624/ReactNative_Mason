import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import {
  Layout,
  Card,
  Badge,
  Subheading,
  Stack,
  Button,
  Pagination,
  TextStyle,
  ResourceList
} from '@shopify/polaris'

import * as bidStatuses from 'constants/bidStatuses'

const StyleWrapper = styled.div`
  .Polaris-Layout__Section + .Polaris-Card__Section {
    padding: 0;
  }
`

class InvitedSubs extends Component {
  getStatus = status => {
    switch (status) {
      case bidStatuses.UNOPENED:
      case bidStatuses.NO_BID:
        return 'attention'
      case bidStatuses.OPENED:
        return 'info'
      case bidStatuses.REJECTED:
        return 'warning'
      default:
        return ''
    }
  }

  renderItem = item => {
    const { id, name, status, phone } = item
    return (
      <ResourceList.Item id={id} accessibilityLabel={`View details for ${id}`}>
        <Stack distribution='fillEvenly' alignment='center'>
          <h3>
            <TextStyle variation='strong'>{name}</TextStyle>
          </h3>
          <Stack distribution='center'>
            <div>{phone}</div>
          </Stack>
          <Stack distribution='center'>
            <Badge status={this.getStatus(status)}>{status}</Badge>
          </Stack>
          <Stack distribution='trailing'>
            <Button size='slim'>Withdraw</Button>
          </Stack>
        </Stack>
      </ResourceList.Item>
    )
  }

  render () {
    const { subs } = this.props
    const resourceName = {
      single: 'sub',
      plural: 'subs'
    }
    return (
      <Card title='Invited subs'>
        <StyleWrapper>
          <Layout.Section />
          <Card.Section>
            <ResourceList
              resourceName={resourceName}
              items={_.values(subs)}
              renderItem={this.renderItem}
            />
          </Card.Section>
          <Card.Section>
            <Pagination
              hasPrevious
              onPrevious={() => {
                console.log('Previous')
              }}
              hasNext
              onNext={() => {
                console.log('Next')
              }}
            />
          </Card.Section>
        </StyleWrapper>
      </Card>
    )
  }
}

export default InvitedSubs
