import React, { Component } from 'react'
import { Route as PublicRoute, Router, Switch, Redirect, Link } from 'react-router-dom'
import { AppProvider, Spinner } from '@shopify/polaris'

import history from 'src/history'
import { TWILIGHT_BLUE } from 'constants/colors'
import { isAuthorized } from 'utils/storage'
import { auth } from 'constants/firebase'
import AppTheme from 'components/AppTheme'
import config from 'src/config'
import 'styles/fonts.css'

import SignIn from 'pages/SignIn'
import SignUp from 'pages/SignUp'
import ForgotPassword from 'pages/ForgotPassword'
import Dashboard from 'pages/Dashboard'
import NotImplemented from 'pages/NotImplemented'
import ProposalCreate from 'pages/ProposalCreate'
import WorkOrderCreate from 'pages/WorkOrderCreate'
import Settings from 'pages/Settings'
import InviteUser from 'pages/InviteUser'
import FinishSignUp from 'pages/FinishSignUp'
import Projects from 'pages/Projects'
import AccountSettings from 'pages/AccountSettings'
import Proposals from 'pages/Proposals'
import WorkOrders from 'pages/WorkOrders'
import WorkOrder from 'pages/WorkOrder'

const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/mason-dev.appspot.com/o/assets%2F%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202019-05-02%20%D0%B2%2011.28.27.png?alt=media&token=a0a6329e-102f-439f-a63b-e70a678993ef'
const SITE_URL = 'https://google.com'

const AdapterLink = ({ url, ...rest }) => <Link to={url} {...rest} />

const Route = ({ component: Component, ...rest }) => (
  <PublicRoute
    {...rest}
    render={props =>
      isAuthorized()
        ? (
          auth.currentUser
            ? <Component {...props} />
            : <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
        )
        : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
    }
  />
)

class App extends Component {
  loadGooglePlacesApi () {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places&language=en`
    document.body.appendChild(script)
  }

  componentDidMount () {
    this.loadGooglePlacesApi()
  }

  render () {
    const theme = {
      colors: {
        topBar: {
          background: TWILIGHT_BLUE
        }
      },
      logo: {
        width: 124,
        topBarSource: LOGO_URL,
        contextualSaveBarSource: LOGO_URL,
        url: SITE_URL,
        accessibilityLabel: 'Company name'
      }
    }
    return (
      <AppTheme>
        <AppProvider theme={theme} linkComponent={AdapterLink}>
          <Router history={history}>
            <Switch>
              <Route exact path='/' component={Dashboard} />
              <Route path='/settings' component={Settings} />
              <Route path='/invite' component={InviteUser} />
              <Route path='/projects/:projectType' component={Projects} />
              <Route path='/subcontractors' component={NotImplemented} />
              <Route path='/payments' component={NotImplemented} />
              <Route path='/proposal/create' component={ProposalCreate} />
              <Route path='/proposals' component={Proposals} />
              <Route path='/workOrders' component={WorkOrders} />
              <Route path='/workOrder/create' component={WorkOrderCreate} />
              <Route path='/workOrder/:id' component={WorkOrder} />
              <Route path='/bids' component={NotImplemented} />
              <Route path='/settings' component={NotImplemented} />
              <Route path='/account' component={AccountSettings} />
              <PublicRoute path='/signin' component={SignIn} />
              <PublicRoute path='/signup' component={SignUp} />
              <PublicRoute path='/reset' component={ForgotPassword} />
              <PublicRoute path='/finishSignUp/:infoId' component={FinishSignUp} />
            </Switch>
          </Router>
        </AppProvider>
      </AppTheme>
    )
  }
}

export default App
