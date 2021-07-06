import React, { Component } from 'react'
import _ from 'lodash'

import { ref } from 'constants/firebase'
import 'src/styles/fonts.css'
import ErrorPage from 'workordersrc/pages/ErrorPage'
import LoadingPage from 'workordersrc/pages/LoadingPage'
import WorkOrderPage from 'workordersrc/pages/WorkOrderPage'

const LOADING = 'LOADING'
const ERROR = 'ERROR'
const WORKORDER = 'WORKORDER'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mode: LOADING
    }
  }

  componentWillUnmount = () => {
    this.workOrderRef.off()
  }

  async componentDidMount () {
    const pth = _.split(window.location.pathname, '/')
    try {
      const workOrderId = pth[1]
      if (workOrderId) {
        const workOrderSN = await ref.child(`/workOrders/${workOrderId}`).once('value')
        let workorder = workOrderSN.val()
        console.log('workorder', workorder)
        if (_.isNil(workorder)) {
          this.setState({
            mode: ERROR,
            error: 'The requested document does not exist'
          })
        } else {
          this.setState({
            mode: WORKORDER,
            workorder
          })
        }
      } else {
        console.log('there should be an error page now')
        this.setState({
          mode: ERROR,
          error: 'The url is not correct'
        })
      }
    } catch (e) {
      console.log('cant get workorder', e)
      this.setState({
        mode: ERROR,
        error: e.code || e.message
      })
    }
  }

  renderWorkOrder = () => {
    const { workorder } = this.state
    return (
      <WorkOrderPage
        workorder={workorder}
      />
    )
  }

  render () {
    const { mode, error } = this.state
    switch (mode) {
      case LOADING: return <LoadingPage />
      case ERROR: return <ErrorPage desc={error} />
      case WORKORDER: return this.renderWorkOrder()
      default: return <div>Not implemented</div>
    }
  }
}

export default App
