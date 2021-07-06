import React, { Component } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import {
  Layout,
  Card,
  Stack,
  Button,
  Pagination,
  TextStyle,
  ResourceList
} from '@shopify/polaris'

const StyleWrapper = styled.div`
  .Polaris-Layout__Section + .Polaris-Card__Section {
    padding: 0;
  }
`
class Bids extends Component {
  renderItem = item => {
    const { id, subName, bid, note } = item
    return (
      <ResourceList.Item id={id} accessibilityLabel={`View details for ${id}`}>
        <Stack distribution='fillEvenly' alignment='center'>
          <h3>
            <TextStyle variation='strong'>{subName}</TextStyle>
          </h3>
          <Stack distribution='center'>
            <div>${bid}</div>
          </Stack>
          <div>
            <i>{note}</i>
          </div>
          <Stack distribution='trailing'>
            <Button size='slim'>Select bid</Button>
          </Stack>
        </Stack>
      </ResourceList.Item>
    )
  }

  render () {
    const { bids, onInvite } = this.props
    const resourceName = {
      singular: 'bid',
      plural: 'bids'
    }
    return (
      <Card title='Bids'>
        <StyleWrapper>
          <Layout.Section />
          <Card.Section>
            <ResourceList
              resourceName={resourceName}
              items={_.values(bids)}
              renderItem={this.renderItem}
            />
          </Card.Section>
          <Card.Section>
            <Stack>
              <Stack.Item fill>
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
              </Stack.Item>
              <Button onClick={onInvite}>Invite additional subs to bid</Button>
            </Stack>
          </Card.Section>
        </StyleWrapper>
      </Card>
    )
  }
}

export default Bids
