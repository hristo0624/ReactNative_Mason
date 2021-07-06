import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import NavigationBar from 'react-native-navbar'
import { View } from 'react-native'

import { fontSize } from 'shared/utils/dynamicSize'
import { NAVBAR_FONT, BLACK10 } from 'shared/constants/colors'
import { DEFAULT_FONT, NAV_BAR_HEIGHT, TITLE_FONT_SIZE } from 'constants/index'

const NavBar = ({ viewport, backgroundColor, hideBorder, title, opacity, ...rest }) => (
  <View>
    <NavigationBar
      tintColor='transparent'
      style={{
        height: fontSize(NAV_BAR_HEIGHT, viewport),
        borderBottomWidth: hideBorder ? 0 : 1,
        borderColor: BLACK10,
        backgroundColor: backgroundColor,
        opacity: opacity
      }}
      statusBar={{
        hidden: true
      }}
      title={{
        ...title,
        style: {
          color: NAVBAR_FONT,
          fontFamily: DEFAULT_FONT,
          fontSize: fontSize(TITLE_FONT_SIZE, viewport),
          ...title.style
        }
      }}
      {...rest}
    />
  </View>
)

NavBar.defaultProps = {
  hideBorder: true,
  title: { title: '' },
  transparent: false,
  opacity: 1
}

NavBar.propTypes = {
  backgroundColor: PropTypes.string,
  hideBorder: PropTypes.bool,
  transparent: PropTypes.bool,
  opacity: PropTypes.number,
  title: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.element
  ])
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(NavBar)
