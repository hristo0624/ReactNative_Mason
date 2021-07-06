import { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class TimerTrigger extends Component {
  constructor (props) {
    super(props)
    const timeNow = _.now()
    this.state = {
      active: false
    }
    this.timerId = setInterval(this.checkActivity, 250)
  }

  componentDidMount = () => this.checkActivity()

  componentWillUnmount () {
    clearInterval(this.timerId)
  }

  checkActivity = () => {
    const { timestamp, delay } = this.props
    const timeNow = _.now()
    this.setState({
      active: timeNow >= timestamp && timeNow < timestamp + delay
    })
  }

  render () {
    const { active } = this.state
    const { componentActive, componentInactive } = this.props
    if (active) {
      return componentActive
    } else {
      return componentInactive
    }
  }
}

TimerTrigger.defaultProps = {
  delay: 3500,
  timestamp: 0,
  componentActive: null,
  componentInactive: null
}

TimerTrigger.propTypes = {
  delay: PropTypes.number,
  timestamp: PropTypes.number,
  componentActive: PropTypes.element,
  componentInactive: PropTypes.element
}

export default TimerTrigger