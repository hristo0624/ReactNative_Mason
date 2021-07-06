import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Navigation, Icon } from '@shopify/polaris'
import { withRouter } from 'react-router-dom'

import home from 'assets/icons/home.svg'
import clients from 'assets/icons/clients.svg'
import settings from 'assets/icons/settings.svg'
import orders from 'assets/icons/orders.svg'
import products from 'assets/icons/products.svg'
import analytics from 'assets/icons/analytics.svg'
import history from 'src/history'

class Menu extends Component {
  isSelected = (url) => url === this.props.location.pathname

  toAddNewProject = () => history.push('/proposal/create')

  render () {
    return (
      <Navigation location='/'>
        <Navigation.Section
          items={[
            {
              label: 'Active Projects',
              icon: orders,
              selected: this.isSelected('/projects/active'),
              url: '/projects/active'
            },
            {
              label: 'Completed Projects',
              icon: products,
              selected: this.isSelected('/projects/completed'),
              url: '/projects/completed'
            },
            {
              label: 'All Subcontractors',
              icon: clients,
              selected: this.isSelected('/subcontractors'),
              url: '/subcontractors'
            },
            {
              label: 'All Payments',
              icon: analytics,
              selected: this.isSelected('/payments'),
              url: '/payments'
            },
            {
              label: 'Proposals',
              icon: home,
              selected: this.isSelected('/proposals'),
              url: '/proposals'
            },
            {
              label: 'Work orders',
              icon: clients,
              selected: this.isSelected('/workOrders'),
              url: '/workOrders'
            },
            {
              label: 'Bids',
              icon: home,
              selected: this.isSelected('/bids'),
              url: '/bids'
            }
          ]}
          action={{
            icon: 'conversation',
            accessibilityLabel: 'Contact support',
            onClick: this.onConversationClick
          }}
        />

        <Navigation.Section
          fill
          title='ACTIVE PROJECTS'
          items={[
          ]}
          action={{
            icon: 'circlePlusOutline',
            accessibilityLabel: 'Add new project',
            onClick: this.toAddNewProject
          }}
        />
        <Navigation.Section
          items={[
            // {
            //   label: 'Refer a Business Owner',
            //   icon: giftCard,
            //   disabled: true,
            //   selected: this.isSelected('/refer_business_owner'),
            //   url: '/refer_business_owner'
            // },
            {
              label: 'Settings',
              icon: settings,
              selected: this.isSelected('/settings'),
              url: '/settings'
            }
          ]}
        />
      </Navigation>
    )
  }
}

Menu.propTypes = {
  toggleMobileNavigation: PropTypes.func
}

export default withRouter(Menu)
