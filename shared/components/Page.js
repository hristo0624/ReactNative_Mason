import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import Constants from 'expo-constants'

import { isIos, majorVersionIOS } from 'constants/index'

const hasStatusBar = isIos && majorVersionIOS >= 11

const ContentContainer = styled.View`
  height: 100%;
  width: 100%;
  display: flex;
  background-color: ${props => props.backgroundColor};
  padding-top: ${hasStatusBar ? 0 : Constants.statusBarHeight};
  ${props => props.customStyle}
`
const FixBottomSafeArea = styled(View)`
  background-color: ${props => props.backgroundColor};
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 100;
  z-index: -1000;
`
const fixStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  height: Constants.statusBarHeight
}

const FixStatusBarColor = ({ color }) => (
  <View
    style={{
      ...fixStyle,
      backgroundColor: color
    }}
  />
)

const Page = ({
  children,
  backgroundColor,
  customStyle,
  statusBarStyle,
  statusBarColor,
  gradient,
  forceInset
}) => {
  return (
    <SafeAreaView forceInset={forceInset} style={{ flex: 1, backgroundColor: statusBarColor || backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={statusBarColor || 'transparent'} translucent />
      <ContentContainer
        backgroundColor={backgroundColor}
        customStyle={customStyle}
      >
        {children}
      </ContentContainer>
      {(hasStatusBar || gradient)
        ? null
        : <FixStatusBarColor color={statusBarColor} />}
      <FixBottomSafeArea backgroundColor={backgroundColor} />
    </SafeAreaView>
  )
}

Page.defaultProps = {
  backgroundColor: 'transparent',
  statusBarStyle: 'light-content',
  customStyle: '',
  gradient: false
}

Page.propTypes = {
  backgroundColor: PropTypes.string,
  statusBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  statusBarColor: PropTypes.string,
  customStyle: PropTypes.string,
  gradient: PropTypes.bool
}

export default Page
