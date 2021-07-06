import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native'

export default class Loading extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator />
      </View>
    )
  }
}

Loading.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: false
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
