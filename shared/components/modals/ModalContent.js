import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SafeAreaView, StatusBar } from 'react-native'

const ContentContainer = styled.View`
  height: 100%;
  width: 100%;
  display: flex;
`
const ModalContent = ({
  children,
  backgroundColor,
  statusBarStyle
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={'black'} translucent />
      <ContentContainer>
        {children}
      </ContentContainer>
    </SafeAreaView>
  )
}

ModalContent.defaultProps = {
  backgroundColor: 'transparent',
  statusBarStyle: 'light-content',
  customStyle: '',
  gradient: false
}

ModalContent.propTypes = {
  backgroundColor: PropTypes.string,
  statusBarStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
  statusBarColor: PropTypes.string,
  customStyle: PropTypes.string,
  gradient: PropTypes.bool
}

export default ModalContent
