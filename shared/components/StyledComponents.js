import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Text, View, ActivityIndicator, Image, Switch } from 'react-native'

import { fontSize } from 'shared/utils/dynamicSize'
import { BOLD_FONT, REGULAR_FONT, MEDIUM_FONT } from 'constants/index'

const mapViewportToProps = state => ({ viewport: state.viewport })

const StyledTextComp = styled(Text)`
  font-size: ${props => fontSize(props.fontSize || 16, props.viewport)};
  font-family: ${props => props.bold ? BOLD_FONT : props.medium ? MEDIUM_FONT : REGULAR_FONT};
  text-align: ${props => props.textAlign || 'left'};
  color: ${props => props.color || 'black'};
  ${props => props.letterSpacing ? `letter-spacing: ${props.letterSpacing};` : ''}
  ${props => props.customStyle || ''}
`
export const StyledText = connect(mapViewportToProps)(StyledTextComp)

const StyledActivityIndicator = styled(ActivityIndicator)`
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  position: absolute;
`

export const Spinner = ({ color = AQUA_MARINE }) => (
  <StyledActivityIndicator color={color} />
)

const LoadingWrapper = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #140f2643;
  ${props => props.customStyle || ''}
`
export const Loading = ({ customStyle, spinnerProps }) => (
  <LoadingWrapper customStyle={customStyle}>
    <Spinner color={'white'} {...spinnerProps} />
  </LoadingWrapper>
)

export const DevIndicator = styled(View)`
  position: absolute;
  left: 30;
  top: 2;
  width: 10;
  height: 10;
  border-width: 1;
  border-radius: 5;
  background-color: red;
  z-index: 10;
`

const StyledSwitchComp = styled(Switch)`
  transform: ${props => `scale(${fontSize(0.8, props.viewport)})`};
`
export const StyledSwitch = connect(mapViewportToProps)(StyledSwitchComp)


export const Dot = styled(View)`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size / 2};
  background-color: ${props => props.color };
  ${props => props.customStyle || ''}
`

export const Badge = styled(View)`
  font-size: ${props => props.size};
  font-family: ${MEDIUM_FONT};
  color: white;
  padding-horizontal: ${props => props.size / 3};
  padding-vertical: ${props => props.size / 10};
  border-radius: ${props => props.size};
  background-color: black;
  ${props => props.customStyle || ''}
`

export const StyledImage = styled(Image)`
  width: ${props => props.size};
  height: ${props => props.size};
  border-radius: ${props => props.size / 2};
  ${props => props.customStyle}
`


