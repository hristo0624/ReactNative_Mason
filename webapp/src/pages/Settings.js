import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  Page,
  Card,
  Stack,
  TextStyle,
  Icon,
  Link,
  Caption
} from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import settings from 'assets/icons/settings.svg'
import user from 'assets/icons/user.svg'
import attachment from 'assets/icons/attachment.svg'
import mention from 'assets/icons/mention.svg'
import search from 'assets/icons/search.svg'

const ItemWrapper = styled.div`
  width: 16em;
`
const IconBg = styled.div`
  padding: 0.8em;
  background-color: #f4f6f8;
`
class Settings extends Component {
  renderItem = (title, desc, icon, url) => {
    return (
      <Stack alignment='center'>
        <IconBg>
          <Icon source={icon} color={'inkLightest'} />
        </IconBg>
        <ItemWrapper>
          <Link url={url}>{title}</Link>
          <Caption>
            <TextStyle variation='subdued'>{desc}</TextStyle>
          </Caption>
        </ItemWrapper>
      </Stack>
    )
  }
  renderContent () {
    return (
      <Card sectioned>
        <Stack>
          {this.renderItem('Account settings', 'Manage your account', settings, '/account')}
          {this.renderItem('User Management', 'Invite your team', user, '/invite')}
          {this.renderItem(
            'Agreements',
            'Caption for settings item goes here',
            attachment
          )}

          {this.renderItem(
            'Contact Us',
            'Send us an email or give us a call',
            mention
          )}
          {this.renderItem(
            'Help',
            'Find answers to your questions in our knowledge base',
            search
          )}
        </Stack>
      </Card>
    )
  }

  render () {
    return (
      <PageLayout>
        <Page title='Settings'>
          {this.renderContent()}
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Settings)
