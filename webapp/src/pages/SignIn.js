import React, { Component } from 'react'
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Card,
  Button,
  Layout,
  PageActions,
  TopBar,
  Frame
} from '@shopify/polaris'

import { signInWithEmailAndPassword } from 'controllers/auth'
import history from 'src/history'
import AuthError from 'components/auth/AuthError'

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: null
    }
  }

  handleSubmit = async () => {
    const { email, password } = this.state
    this.setState({ loading: true })
    const er = await signInWithEmailAndPassword(email, password)
    if (er) {
      this.setState({ loading: false, error: er.message })
    }
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

  toForgotPassword = () => {
    history.push('/reset')
  }

  toSignUp = () => {
    history.push('/signup')
  }

  renderPasswordInput = () => (
    <TextField
      label='Password'
      type='password'
      autoComplete
      value={this.state.password}
      onChange={this.handleChange('password')}
    />
  )

  renderSubmitButton = () => {
    const { loading } = this.state
    return (
      <Button submit primary loading={loading}>
        Sign in
      </Button>
    )
  }

  render () {
    const { error, loading } = this.state
    return (
      <Frame topBar={<TopBar />}>
        <Page
          title='Welcome back!'
          breadcrumbs={[{ content: 'Sign up', onAction: this.toSignUp }]}
        >
          <Layout>
            <AuthError error={error} />
            <Layout.Section>
              <Card sectioned>
                <Form onSubmit={this.handleSubmit}>
                  <FormLayout>
                    {this.renderEmailInput()}
                    {this.renderPasswordInput()}
                  </FormLayout>
                </Form>
              </Card>
            </Layout.Section>
          </Layout>
          <PageActions
            primaryAction={{ content: 'Sign in', disabled: loading || error, onAction: this.handleSubmit }}
            secondaryActions={[{ content: 'Forgot password?', onAction: this.toForgotPassword }]}
          />
        </Page>
      </Frame>
    )
  }
}

export default SignIn
