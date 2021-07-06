import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <View>
        <Text>Home page</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(Home)
