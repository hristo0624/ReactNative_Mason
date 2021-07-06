import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Card,
  Button,
  Frame,
  TopBar,
  Layout,
  PageActions
} from '@shopify/polaris'

import { signUpWithEmailAndPassword } from 'controllers/auth'
import { setCompanyName } from 'controllers/init'
import history from 'src/history'
import AuthError from 'components/auth/AuthError'

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
      userName: '',
      companyName: '',
      password: '',
      email: ''
    }
  }

  checkIsEmpty = v => v === '' || _.isEmpty(v) || _.isNil(v)

  handleSubmit = async () => {
    const { email, password, userName, companyName } = this.state
    if (this.checkIsEmpty(email)) {
      this.setState({ error: 'Email cannot be blank' })
      return null
    } else if (this.checkIsEmpty(password)) {
      this.setState({ error: 'Password cannot be blank' })
      return null
    } else if (this.checkIsEmpty(userName)) {
      this.setState({ error: 'Name cannot be blank' })
      return null
    } else if (this.checkIsEmpty(companyName)) {
      this.setState({ error: 'Company name cannot be blank' })
      return null
    }
    setCompanyName(companyName)
    this.setState({ loading: true })
    const er = await signUpWithEmailAndPassword(email, password, userName)
    if (er) {
      this.setState({ loading: false, error: er.message })
    }
  }

  toForgotPassword = () => {
    history.push('/reset')
  }

  toSignIn = () => {
    history.push('/signin')
  }

  handleChange = field => value => this.setState({ [field]: value, error: null })

  renderEmailInput = () => (
    <TextField
      label='Email'
      type='email'
      autoComplete
      value={this.state.email}
      onChange={this.handleChange('email')}
    />
  )

  renderPasswordInput = () => (
    <TextField
      label='Password'
      type='password'
      autoComplete
      value={this.state.password}
      onChange={this.handleChange('password')}
    />
  )

  renderCompanyNameInput = () => (
    <TextField
      label='Company name'
      type='text'
      value={this.state.companyName}
      onChange={this.handleChange('companyName')}
    />
  )

  renderUserNameInput = () => (
    <TextField
      label='Full name'
      type='text'
      value={this.state.userName}
      onChange={this.handleChange('userName')}
    />
  )

  renderSubmitButton = () => {
    const { loading } = this.state
    return (
      <Button submit primary loading={loading}>
        Sign up
      </Button>
    )
  }

  render () {
    const { error, loading } = this.state
    return (
      <Frame topBar={<TopBar />}>
        <Page
          title='Create your Mason account now'
          breadcrumbs={[{ content: 'Sign in', onAction: this.toSignIn }]}
        >
          <Layout>
            <AuthError error={error} />
            <Layout.Section>
              <Card sectioned>
                <Form onSubmit={this.handleSubmit}>
                  <FormLayout>
                    {this.renderEmailInput()}
                    {this.renderUserNameInput()}
                    {this.renderCompanyNameInput()}
                    {this.renderPasswordInput()}
                  </FormLayout>
                </Form>
              </Card>
            </Layout.Section>
          </Layout>
          <PageActions primaryAction={{ content: 'Create account', disabled: loading || error, onAction: this.handleSubmit }} />
        </Page>
      </Frame>
    )
  }
}

export default connect()(SignUp)
