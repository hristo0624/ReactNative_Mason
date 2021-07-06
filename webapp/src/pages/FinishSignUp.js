import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Page,
  Spinner,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  Banner
} from '@shopify/polaris'
import _ from 'lodash'

import { auth } from 'constants/firebase'
import history from 'src/history'
import { fetchInviteInfo, updatePassword } from 'controllers/auth'
import { switchAccount } from 'controllers/user'

const LOADING = 'LOADING'
const SET_PASSWORD = 'SET_PASSWORD'
const ERROR = 'ERROR'

class FinishSignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: LOADING,
      password: ''
    }
  }

  async componentDidMount () {
    try {
      await auth.signOut()
      const { match } = this.props
      const infoId = _.get(match, 'params.infoId')
      console.log('FinishSignUp componentDidMount', match)
      if (infoId) {
        const info = await fetchInviteInfo(infoId)
        console.log('info received', info)
        if (!_.isNil(info)) {
          const res = await auth.signInWithEmailLink(info.email, info.link)
          console.log('sign in by email res', res)
          if (_.has(res, 'user.uid')) {
            await switchAccount(info.accountId)
            this.setState({
              mode: SET_PASSWORD
            })
          }
        } else {
          this.setState({
            mode: ERROR,
            error: 'The url is not more valid'
          })
        }
      } else {
        history.push('/signin')
      }
    } catch (e) {
      console.log('finish sign up error', e)
      this.setState({
        mode: ERROR,
        error: e.message
      })
    }
  }

  toSignIn = () => history.push('/signin')

  renderError = () => {
    const { error } = this.state
    return (
      <Banner
        title={error}
        action={{ content: 'Sign in', onAction: this.toSignIn }}
        status='critical'
      />
    )
  }

  renderContent = () => {
    const { mode } = this.state
    switch (mode) {
      case LOADING: return <Spinner />
      case SET_PASSWORD: return this.renderSetPasswordForm()
      case ERROR: return this.renderError()
    }
  }

  onPasswordSet = () => history.push('/')

  onPasswordError = (err) => {
    console.log('onPasswordError')
    this.setState({ passwordError: err.message })
  }

  submitPassword = () => {
    const { password } = this.state
    const { dispatch } = this.props
    console.log('submitPassword')
    if (password && password !== '') {
      dispatch(updatePassword(password, this.onPasswordError, this.onPasswordSet))
    }
  }

  onPasswordChange = (v) => {
    this.setState({
      password: v,
      passwordError: ''
    })
  }

  renderSetPasswordForm = () => {
    const { password, passwordError } = this.state
    return (
      <Card title='Set password' sectioned>
        <Form onSubmit={this.submitPassword}>
          <FormLayout>
            <TextField
              label='Password'
              type='password'
              value={password}
              error={passwordError}
              onChange={this.onPasswordChange}
            />
            <Button submit primary>Submit</Button>
          </FormLayout>
        </Form>
      </Card>

    )
  }

  render () {
    return (
      <Page
        separator
        title={'Finish sign up'}
        primaryAction={{ content: `Sign in`, onAction: this.toSignIn }}
      >
        {this.renderContent()}
      </Page>
    )
  }
}

export default connect()(FinishSignUp)
