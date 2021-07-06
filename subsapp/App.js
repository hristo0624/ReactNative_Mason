import React from 'react'
import { AppState, Keyboard, Dimensions } from 'react-native'
import { Provider } from 'react-redux'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import { Updates, AppLoading } from 'expo'

import { DevIndicator } from 'shared/components/StyledComponents'
import navigationService from 'shared/navigation/service'

import store from 'model/store'
import { updateViewport, updateKeyboardHeight } from 'model/actions/viewportAC'
import { appInitialized } from 'controllers/init'
import { appName } from 'constants/index'
import { AppContainer } from 'navigation/index'
import config from 'config'

export default class App extends React.Component {
  constructor (props) {
    super(props)
      this.state = {
        isReady: false,
        appState: AppState.currentState
      }
  }

  async componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
    this.dimensionsListener = Dimensions.addEventListener('change', () => store.dispatch(updateViewport()))
    this.appStateListener = AppState.addEventListener('change', this.appStateChanged)
  }

  loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/illustration.png'),
        require('./assets/images/logo.png'),
      ]),
      Font.loadAsync({
        'CircularStd-Bold': require('assets/fonts/CircularStd-Bold.ttf'),
        'CircularStd-Book': require('assets/fonts/CircularStd-Book.ttf'),
        'CircularStd-Medium': require('assets/fonts/CircularStd-Medium.ttf'),
        'Lato-Light': require('assets/fonts/Lato-Light.ttf'),
        'Lato-Bold': require('assets/fonts/Lato-Bold.ttf'),
        'Tondo-Bold': require('assets/fonts/Tondo-Bold.ttf'),
        'entypo': require('@expo/vector-icons/src/vendor/react-native-vector-icons/Fonts/Entypo.ttf'),
        'MaterialCommunityIcons': require('@expo/vector-icons/src/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf')
      })
    ])
  }

  keyboardDidShow = (e) => {
    store.dispatch(updateKeyboardHeight(e.endCoordinates.height))
  }

  keyboardDidHide = () => {
    store.dispatch(updateKeyboardHeight(0))
  }

  appStateChanged = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // await this.getLocale()
      try {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()
          Alert.alert(
            `New ${appName} version`,
            'There is a new version available. Would you like to update now?',
            [
              { text: 'Update', onPress: () => Updates.reloadFromCache() },
              { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
            ],
            { cancelable: true }
          )
        }
      } catch (e) {
        console.log('new build update error', e)
      }
    }
    this.setState({ appState: nextAppState })
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
    this.dimensionsListener.remove()
    this.appStateChanged.remove()
  }

  setTopLevelNavigator = (ref) => navigationService.setTopLevelNavigator(ref)

  getActiveRouteName (navigationState) {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
      return this.getActiveRouteName(route)
    }
    return route.routeName
  }

  renderDevIndicator = () => {
    if (config.isDev) {
      return <DevIndicator />
    }
  }

  onLoadingDone = () => {
    this.setState({ isReady: true })
    store.dispatch(appInitialized())
  }

  render () {
    const { isReady } = this.state
    if (isReady) {
      return (
        <Provider store={store}>
          <React.Fragment>
            <AppContainer
              ref={this.setTopLevelNavigator}
            />
            {this.renderDevIndicator()}
          </React.Fragment>
        </Provider>
      )
    } else {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onFinish={this.onLoadingDone}
          onError={console.warn}
        />
      )
    }
  }
}

