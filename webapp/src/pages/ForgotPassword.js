import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
  Page,
  Form,
  FormLayout,
  TextField,
  Card,
  Frame,
  TopBar,
  Layout,
  PageActions,
  Banner
} from '@shopify/polaris'

import { sendPasswordResetEmail } from 'controllers/auth'
import history from 'src/history'
import AuthError from 'components/auth/AuthError'

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: null,
      done: false
    }
  }

  checkIsEmpty = v => v === '' || _.isEmpty(v) || _.isNil(v)

  handleSubmit = async () => {
    const { email } = this.state
    if (this.checkIsEmpty(email)) {
      this.setState({ error: 'Email cannot be blank' })
      return null
    }
    const er = await sendPasswordResetEmail(email)
    if (er) {
      this.setState({ loading: false, error: er.message })
    } else {
      this.setState({
        done: true
      })
    }
  }

  handleChange = field => value => this.setState({ [field]: value, error: null })

  renderEmailInput = () => (
    <TextField
      label="Enter your email address below and we'll send you a link to reset your password."
      type='email'
      autoComplete
      placeholder='email'
      value={this.state.email}
      onChange={this.handleChange('email')}
    />
  )

  toSignIn = () => {
    history.push('/signin')
  }

  renderContent () {
    const { done, email } = this.state
    if (done) {
      return (
        <Banner
          status='success'
          title='Your password reset'
          action={{ content: 'Open sign in page', onAction: this.toSignIn }}
        >
          <p>Follow instructions we have sent to <b>{email}</b></p>

        </Banner>
      )
    } else {
      return (
        <Card sectioned>
          <Form onSubmit={this.handleSubmit}>
            <FormLayout>
              {this.renderEmailInput()}
            </FormLayout>
          </Form>
        </Card>
      )
    }
  }

  render () {
    const { error, loading, done } = this.state
    return (
      <Frame topBar={<TopBar />}>
        <Page
          title='Reset your password'
          breadcrumbs={[{ content: 'Sign in', onAction: this.toSignIn }]}
        >
          <Layout>
            <AuthError error={error} />
            <Layout.Section>
              {this.renderContent()}
            </Layout.Section>
          </Layout>
          <PageActions primaryAction={done ? null : { content: 'Send reset password email', disabled: loading || error, onAction: this.handleSubmit }} />
        </Page>
      </Frame>
    )
  }
}

export default connect()(ForgotPassword)
