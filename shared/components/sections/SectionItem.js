import React, {Component} from 'react'
import styled, {css} from 'styled-components'
import {connect} from 'react-redux'
import {Image, TouchableOpacity, View} from 'react-native'
import {Entypo, MaterialIcons} from '@expo/vector-icons'
import PropTypes from 'prop-types'
import _ from 'lodash'
import * as ReactIs from "react-is"

import {StyledText} from 'shared/components/StyledComponents'
import Chevron from 'shared/components/Chevron'
import {fontSize, getHeight, getWidth} from 'shared/utils/dynamicSize'

import {REGULAR_FONT} from 'constants/index'
import {BLACK10, CORAL, LIGHT_NAVY, STEEL, WHITE} from 'shared/constants/colors'

const Wrapper = styled(View)`
  background-color: ${props => props.color};
  /* min-height: ${props => getHeight(props.desc ? 70 : 60, props.viewport)}; */
  ${props => props.customStyle || ''}
`
const containerStyle = css`
  min-height: ${props => getHeight(props.desc ? 70 : 60, props.viewport)};
  padding-right: ${props => getWidth(15, props.viewport)};
  margin-left: ${props => getWidth(15, props.viewport)};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  ${props => props.customStyle || ''}
`
const ClickableContainer = styled(TouchableOpacity)`
  ${containerStyle}
`
const SimpleContainer = styled(View)`
  ${containerStyle}
`
const Title = styled(StyledText)`
  font-size: ${props => fontSize(16, props.viewport)};
  color: ${props => props.customTitleColor || (props.addNewField ? LIGHT_NAVY : props.error ? CORAL : LIGHT_NAVY)};
  opacity: ${props => props.disabled ? 0.5 : 1};
  margin-left: ${props => props.addNewField ? getWidth(0, props.viewport) : 0};
  letter-spacing: 0.14;
`
const Desc = styled(Title)`
  font-size: ${props => fontSize(12, props.viewport)};
  font-family: ${REGULAR_FONT};
  max-width: 90%;
  color: ${props => props.error ? CORAL : STEEL};
`

const ActionContainer = styled.View`
`
const Border = styled.View`
  width: 100%;
  bottom: 1;
  border-bottom-width: ${props => props.showBorder ? 1 : 0};
  border-color: ${BLACK10};
  margin-left: ${props => props.noMargin ? 0 : getWidth(15, props.viewport)};
  position: absolute;
`

class SectionItem extends Component {
  renderDescription () {
    const {desc, disabled, viewport, error} = this.props
    if ((desc && _.isString(desc)) || (error && _.isString(error))) {
      return (
        <Desc
          viewport={viewport}
          disabled={disabled}
          error={error}>
          {error ? error : desc}
        </Desc>
      )
    } else if (desc) {
      return desc
    }
  }

  onActionFieldMounted = (ref) => {
    if (ref) this.actionFieldRef = ref
  }

  renderAction () {
    const {viewport, actionField, disabled, noAction} = this.props
    if (noAction) {
      return null;
    }
    let action = <Chevron name='chevron-right' size={fontSize(20, viewport)} disabled={disabled}/>
    if (ReactIs.typeOf(actionField) === ReactIs.ForwardRef) {
      action = React.cloneElement(actionField, {ref: this.onActionFieldMounted})
    } else if (_.isObject(actionField)) {
      action = actionField
    }
    return (
      <ActionContainer viewport={viewport}>
        {action}
      </ActionContainer>
    )
  }

  renderTitle = () => {
    const {title, viewport, disabled, addNewField, error, customTitleColor} = this.props
    if (_.isString(title)) {
      return (
        <Title
          viewport={viewport}
          disabled={disabled}
          addNewField={addNewField}
          error={error}
          customTitleColor={customTitleColor}
          bold
        >
          {title}
        </Title>
      )
    } else if (!_.isNil(title)) {
      return title
    } else {
      return null
    }
  }

  renderContent = () => {
    const {customContent, disabled} = this.props
    const {viewport, addNewField, wallet, customImage, checkMark} = this.props
    if (customContent) {
      return customContent
    } else {
      return (
        <React.Fragment>
          <View style={{flex: 7}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {addNewField && (
                <Entypo
                  style={{marginRight: getWidth(5, viewport), opacity: disabled ? 0.5 : 1}}
                  size={fontSize(22, viewport)}
                  name='plus'
                  color={LIGHT_NAVY}
                />
              )}
              {wallet && (
                <MaterialIcons
                  style={{marginRight: getWidth(5, viewport), opacity: disabled ? 0.5 : 1}}
                  size={fontSize(22, viewport)}
                  name='account-balance-wallet'
                  color={LIGHT_NAVY}
                />
              )}
              {customImage && (
                <Image
                  source={customImage}
                  style={{
                    marginRight: getWidth(5, viewport),
                    opacity: disabled ? 0.5 : 1
                  }}
                />
              )}
              {this.renderTitle()}
            </View>
            {this.renderDescription()}
          </View>
          {this.renderAction()}
        </React.Fragment>
      )
    }
  }

  onPress = () => {
    const {disabled, onPress} = this.props
    if (!disabled) {
      if (this.actionFieldRef && this.actionFieldRef.onContainerClick) this.actionFieldRef.onContainerClick()
      if (onPress) {
        onPress()
      }
    }
  }

  render () {
    const {showBorder, viewport, disabled, desc, backgroundColor, noMargin, containerCustomStyle, notClickable, wrapperCustomStyle} = this.props
    const Container = (disabled || notClickable) ? SimpleContainer : ClickableContainer
    return (
      <Wrapper customStyle={wrapperCustomStyle} desc={desc} viewport={viewport} color={backgroundColor}>
        <Container
          desc={desc}
          viewport={viewport}
          activeOpacity={0.75}
          onPress={this.onPress}
          customStyle={containerCustomStyle}
        >
          {this.renderContent()}
        </Container>
        <Border viewport={viewport} showBorder={showBorder} noMargin={noMargin}/>
      </Wrapper>
    )
  }
}

SectionItem.defaultProps = {
  showBorder: false,
  disabled: false,
  addNewField: false,
  desc: '',
  backgroundColor: WHITE,
  notClickable: false
}

SectionItem.propTypes = {
  title: PropTypes.node,
  showBorder: PropTypes.bool,
  viewport: PropTypes.object.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  addNewField: PropTypes.bool,
  desc: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  actionField: PropTypes.element,
  customContent: PropTypes.element,
  containerCustomStyle: PropTypes.string,
  notClickable: PropTypes.bool,
  error: PropTypes.string,
  noMargin: PropTypes.bool
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(SectionItem)
