import React, { Component } from 'react'
import { Dimensions, Keyboard, StatusBar, AppState, Alert, Linking } from 'react-native'
import { Provider } from 'react-redux'
import { Updates, AppLoading } from 'expo'
import * as Permissions from 'expo-permissions'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
// import { useScreens } from 'react-native-screens'
// import firebase from 'firebase'

import store from 'model/store'
import { updateViewport, updateKeyboardHeight } from 'model/actions/viewportAC'
import { appInitialized } from 'controllers/init'
import { AppContainer } from 'navigation/index'
import navigationService from 'shared/navigation/service'
// import { receivePermission } from 'model/actions/permissionsAC'
// import { firebaseMessaging } from 'constants/firebase'
import { trackScreen, trackAppLaunch, trackDeepLinkUrl, enableUninstallTracking } from 'utils/analytics'
import config from 'config'
import { DevIndicator } from 'shared/components/StyledComponents'

// import 'utils/crashlyticsSetup'
// import { getReferrer } from 'utils/dynamicLinks'
// import { setReferrer } from 'model/actions/referrerAC'

// import config from 'config'
// Sentry.enableInExpoDevelopment = false
// Sentry.config(config.sentryPublicDSN).install()

// useScreens()

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
      currentLocale: null,
      isReady: false
    }
  }

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide)
    this.dimensionsListener = Dimensions.addEventListener('change', () => store.dispatch(updateViewport()))
    this.appStateListener = AppState.addEventListener('change', this.appStateChanged)
    StatusBar.setBarStyle('light-content')

    // await this.loadResourcesAsync()

    // await this.updatePermissions()

    // const enabledNotifications = await firebaseMessaging.hasPermission()
    // if (!enabledNotifications) {
    //   try {
    //     await firebaseMessaging.requestPermission()
    //     if (Platform.OS === 'ios') {
    //       console.log('ios: registerForRemoteNotifications')
    //       await firebaseMessaging.ios.registerForRemoteNotifications()
    //       const APNSToken = await firebaseMessaging.ios.getAPNSToken()
    //       console.log('APNSToken received', APNSToken)
    //     }
    //   } catch (e) {
    //     console.log('message permission is not granted')
    //   }
    // } else {
    //   if (Platform.OS === 'ios') {
    //     console.log('--- ios: registerForRemoteNotifications')
    //     await firebaseMessaging.ios.registerForRemoteNotifications()
    //     const APNSToken = await firebaseMessaging.ios.getAPNSToken()
    //     console.log('---- APNSToken received', APNSToken)
    //   }
    // }

    // this.unsubscribeFromMessageListener = firebaseMessaging.onMessage((message) => {
    //   console.log('receive message', message)
    // })

    Linking.getInitialURL().then((url) => {
      console.log('initial url', url)
      trackDeepLinkUrl(url)
    })

    enableUninstallTracking()

    // firebase.links()
    //   .getInitialLink()
    //   .then((url) => {
    //     console.log('handleInitialLink', url)
    //     if (url) {
    //       const refUid = getReferrer(url)
    //       if (refUid) {
    //         store.dispatch(setReferrer(refUid))
    //       }
    //     }
    //   }).catch(e => console.log('getInitialLink error', e.message))

    // this.unsubscribeFromLinkListener = firebase.links().onLink((url) => {
    //   console.log('onLink', url)
    // })
  }

  loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/drawer/profile.png'),
        require('./assets/drawer/security.png'),
        require('./assets/drawer/work-info.png'),
        require('./assets/drawer/bank.png'),
        require('./assets/drawer/rewards.png'),
        require('./assets/drawer/help.png'),
        require('./assets/images/create-group.png'),
        require('./assets/images/mason-logo.png'),
        require('./assets/images/search.png')
        // require('./assets/images/check_progress.png'),
        // require('./assets/icons/green-checkbox.png'),
        // require('./assets/icons/immediate.png'),
        // require('./assets/icons/error-exclamation.png'),
        // require('./assets/icons/yellow-verifying.png'),
        // require('./assets/images/iconfinder-gift.png'),
        // require('./assets/images/maxed-out-icon.png')
      ]),
      Font.loadAsync({
        'CircularStd-Bold': require('assets/fonts/CircularStd-Bold.ttf'),
        'CircularStd-Book': require('assets/fonts/CircularStd-Book.ttf'),
        'CircularStd-BookItalic': require('assets/fonts/CircularStd-BookItalic.ttf'),
        'CircularStd-Medium': require('assets/fonts/CircularStd-Medium.ttf'),
        'Lato-Light': require('assets/fonts/Lato-Light.ttf'),
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

  checkPermission = async (permission) => {
    const { status } = await Permissions.getAsync(permission)
    console.log('receive', permission, status)
    // store.dispatch(receivePermission(permission, status))
  }

  async updatePermissions () {
    await this.checkPermission(Permissions.LOCATION)
    await this.checkPermission(Permissions.NOTIFICATIONS)
  }

  appStateChanged = async (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      try {
        trackAppLaunch()
        await this.updatePermissions()
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          console.log('new update is available, manifest', update.manifest)
          const updateInfo = await Updates.fetchUpdateAsync()
          console.log('update uploaded to cache, info:', updateInfo)
          Alert.alert(
            'New Friday version',
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
    this.unsubscribeFromMessageListener()
    this.unsubscribeFromLinkListener()
  }

  onAppContainerMounted = (ref) => navigationService.setTopLevelNavigator(ref)

  getActiveRouteName = navigationState => {
    if (!navigationState) {
      return null
    }
    const route = navigationState.routes[navigationState.index]
    if (route.routes) {
      return this.getActiveRouteName(route)
    }
    return route.routeName
  }

  onNavigationStateChange = (prevState, currentState) => {
    const currentScreen = this.getActiveRouteName(currentState)
    const prevScreen = this.getActiveRouteName(prevState)
    if (prevScreen !== currentScreen) {
      trackScreen(currentScreen)
    }
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
              onNavigationStateChange={this.onNavigationStateChange}
              ref={this.onAppContainerMounted}
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
