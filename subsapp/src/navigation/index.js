import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
import _ from 'lodash'

import Loading from 'shared/pages/Loading'

import screens from 'constants/screens'
import SignIn from 'pages/SignIn'
import EnterCode from 'pages/EnterCode'
import Home from 'pages/Home'
import HowItWorks from 'pages/HowItWorks'
import Settings from 'pages/Settings'
import Chat from 'pages/Chat'
import VerifySubcontractor from 'pages/VerifySubcontractor'
import WorkOrderList from 'pages/WorkOrderList'
import ViewWorkOrder from 'pages/ViewWorkOrder'
import CreateQuote from 'pages/CreateQuote'
import CreateLineItem from 'pages/createQuote/CreateLineItem'
import ViewQuote from 'pages/createQuote/ViewQuote'

const navigatorConfig = {
  defaultNavigationOptions: {
    header: null
  }
}

const AppStack = createStackNavigator(
  {
    [screens.VERIFY_SUBCONTRACTOR]: VerifySubcontractor,
    [screens.HOME]: Home,
    [screens.HOW_IT_WORKS]: HowItWorks,
    [screens.SETTINGS]: Settings,
    [screens.CHAT]: Chat,
    [screens.WORK_ORDER_LIST]: WorkOrderList,
    [screens.VIEW_WORK_ORDER]: ViewWorkOrder,
    [screens.CREATE_QUOTE]: CreateQuote,
    [screens.CREATE_LINE_ITEM]: CreateLineItem,
    [screens.VIEW_QUOTE]: ViewQuote
  },
  navigatorConfig
)

const AuthStack = createStackNavigator(
  {
    [screens.SIGN_IN]: SignIn,
    [screens.ENTER_CODE]: EnterCode
  },
  navigatorConfig
)

const RootNavigator = createSwitchNavigator(
  {
    [screens.LOADING]: Loading,
    [screens.AUTH]: AuthStack,
    [screens.APP]: AppStack
  },
  {
    initialRouteName: screens.LOADING
  }
)

export const AppContainer = createAppContainer(RootNavigator)
