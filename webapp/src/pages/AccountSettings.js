import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Card
} from '@shopify/polaris'

import PageLayout from 'components/pageStructure/PageLayout'
import { updateCompany } from 'controllers/data'
import history from 'src/history'
import AddressAutocomplete from 'components/common/AddressAutocomplete'

class AccountSettings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: null,
      email: null,
      phone: null,
      address: null,
      apartment: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.company !== state.prevCompany) {
      return {
        ...props.company,
        prevCompany: props.company
      }
    }
    return null
  }

  handleChange = field => value => {
    this.setState({ [field]: value })
  }

  handleSubmit = async () => {
    const { name, email, phone, address, apartment } = this.state
    await updateCompany({
      name,
      email,
      phone,
      address,
      apartment
    })
  }

  gotoSettings = () => {
    history.push('/settings')
  }

  render () {
    const { name, email, phone, address, apartment } = this.state
    return (
      <PageLayout>
        <Page
          title='Account Settings'
          separator
          breadcrumbs={[{ content: 'Settings', onAction: this.gotoSettings }]}
          primaryAction={{ content: 'Save', onAction: this.handleSubmit }}
        >
          <Card sectioned title='Company information'>
            <Form onSubmit={this.handleSubmit}>
              <FormLayout>
                <TextField
                  label='Company Name'
                  type='text'
                  value={name}
                  onChange={this.handleChange('name')}
                />
                <TextField
                  label='Company Email'
                  type='email'
                  value={email}
                  onChange={this.handleChange('email')}
                />
                <TextField
                  label='Company Phone'
                  type='tel'
                  value={phone}
                  onChange={this.handleChange('phone')}
                />
                <AddressAutocomplete
                  label='Company address'
                  value={address}
                  onSelect={this.handleChange('address')}
                />
                <TextField
                  label='Apartment/Suite/floor'
                  value={apartment}
                  onChange={this.handleChange('apartment')}
                />
              </FormLayout>
            </Form>
          </Card>
        </Page>
      </PageLayout>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account
})

export default connect(mapStateToProps)(AccountSettings)
