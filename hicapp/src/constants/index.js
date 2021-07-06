import { Platform, Dimensions } from 'react-native'
import Constants from 'expo-constants'
import _ from 'lodash'

export const isIos = Platform.OS === 'ios'
export const isAndroid = !isIos

const VIEWPORT = Dimensions.get('window')
export const isIphoneX = (
  isIos &&
  (_.toLower(_.get(Constants, ['platform', 'ios', 'model'])).startsWith('iphone x') ||
  (VIEWPORT.height === 812 || VIEWPORT.width === 812) || // iphone x iphone xs
  (VIEWPORT.height === 896 || VIEWPORT.width === 896)) // iphone xs max iphone xr
)

export const majorVersionIOS = parseInt(Platform.Version, 10)

export const DEFAULT_FONT = 'CircularStd-Book'
export const REGULAR_FONT = 'CircularStd-Book'
export const ITALIC_FONT = 'CircularStd-BookItalic'
export const MEDIUM_FONT = 'CircularStd-Medium'
export const BOLD_FONT = 'CircularStd-Bold'
export const LIGHT_FONT = 'Lato-Light'
export const LOGO_FONT = 'Tondo-Bold'

export const appVersion = _.get(Constants, 'manifest.version', '')
export const appName = _.get(Constants, 'manifest.name', '')

export const isExpo = Constants.appOwnership === 'expo'

export const LOCATION_TASK_NAME = 'background-location-task'

export const CURRENCY_SYMBOL = '$'
export const NAV_BAR_HEIGHT = 50
export const TITLE_FONT_SIZE = 18
export const SUBTITLE_FONT_SIZE = 13

export const ACTIVE_OPACITY = 0.75

export const TYPING_DELAY = 3000

export const MESSAGE_COMPOSERBOX_HEIGHT = 58
export const MESSAGE_TEXTINPUT_HEIGHT = 30
