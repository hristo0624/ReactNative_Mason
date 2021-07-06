import {
  NavigationActions,
  DrawerActions,
  StackActions
} from 'react-navigation'
import _ from 'lodash'

let _navigator

function setTopLevelNavigator (navigatorRef) {
  _navigator = navigatorRef
}

function navigate (routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  )
}

function toggleDrawer () {
  _navigator.dispatch(DrawerActions.toggleDrawer())
}

function goBack () {
  _navigator.dispatch(NavigationActions.back())
}

function push (routeName, params) {
  const currentR = getCurrentRoute()
  if (_.get(currentR, 'routeName') !== routeName) {
    const pushAction = StackActions.push({ routeName, params })
    _navigator.dispatch(pushAction)
  } else {
    console.log('cant push the same rout name as current one, currentR', currentR, 'routeName', routeName)
  }
}

function pop (n = 1) {
  const popAction = StackActions.pop({ n })
  _navigator.dispatch(popAction)
}

function popToTop () {
  const popToTopAction = StackActions.popToTop()
  _navigator.dispatch(popToTopAction)
}

function replace (routeName, params) {
  const replaceAction = StackActions.replace({ routeName, params })
  _navigator.dispatch(replaceAction)
}

function getCurrentRoute () {
  let route = _navigator.state.nav
  while (route.routes) {
    route = route.routes[route.index]
  }
  return route
}

export default {
  navigate,
  setTopLevelNavigator,
  toggleDrawer,
  goBack,
  push,
  pop,
  replace,
  getCurrentRoute,
  popToTop
}
