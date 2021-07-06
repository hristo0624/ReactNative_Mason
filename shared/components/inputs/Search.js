import React from 'react'
import { connect } from 'react-redux'
import { View, TouchableOpacity, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import { FontAwesome } from '@expo/vector-icons'
import styled from 'styled-components'

import { getHeight, getWidth, fontSize } from 'shared/utils/dynamicSize'
import { WHITE, DUSK, ICE_BLUE } from 'shared/constants/colors'
import { REGULAR_FONT } from 'constants/index'

const StyledElevatedView = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${props => props.customStyle || ''}
`
const Icon = styled(FontAwesome)`
  flex: 1;
  left: ${props => getWidth(10, props.viewport)};
  z-index: 1;
`

const IconRightContainer = styled(TouchableOpacity)`
  flex: 1;
  /* margin-right: ${props => getWidth(10, props.viewport)}; */
  align-items: center;
  justify-content: center;
  /* background-color: yellow; */
`
const IconRight = styled(FontAwesome)`
  z-index: 1;
`

const StyledTextInput = styled(TextInput)`
  flex: 8;
  width: 100%;
  height: ${props => getHeight(48, props.viewport)};
  background-color: ${props => props.type === 'dark' ? ICE_BLUE : WHITE};
  border-radius: 4;
  font-size: ${props => fontSize(14, props.viewport)};
  font-family: ${REGULAR_FONT};
  color: ${DUSK};
  ${props => props.inputCustomStyle || ''}
`

const Spinner = styled.ActivityIndicator`
  margin-left: ${props => getWidth(10, props.viewport)};
`

const Search = ({ placeholder, getRef, viewport, onBlur, onReset, customStyle, inputCustomStyle, loading, ...rest }) => {
  return (
    <StyledElevatedView elevation={2} customStyle={customStyle}>
      <Icon viewport={viewport} name='search' size={fontSize(16, viewport)} color={DUSK} />
      <StyledTextInput
        autoCapitalize='none'
        autoCorrect={false}
        underlineColorAndroid='transparent'
        viewport={viewport}
        onBlur={onBlur}
        placeholderTextColor='#9C9CA0'
        placeholder={placeholder}
        ref={getRef}
        inputCustomStyle={inputCustomStyle}
        clearButtonMode={onReset ? 'never' : 'while-editing'}
        {...rest}
      />
      {loading ? <Spinner color={DUSK} viewport={viewport} /> : null}
      { onReset
        ? <IconRightContainer
          activeOpacity={0.75}
          viewport={viewport}
          onPress={onReset}
        >
          <IconRight
            viewport={viewport}
            name='times-circle-o'
            size={fontSize(20, viewport)}
            color={DUSK}
          />
        </IconRightContainer>
        : null
      }
    </StyledElevatedView>
  )
}

Search.defaultProps = {
  getRef: () => null,
  onBlur: () => null,
  type: '',
  ...TextInput.defaultProps
}

Search.propTypes = {
  type: PropTypes.string,
  getRef: PropTypes.func,
  onBlur: PropTypes.func,
  customStyle: PropTypes.string,
  onReset: PropTypes.func,
  inputCustomStyle: PropTypes.string,
  ...TextInput.propTypes
}

export default connect(state => ({ viewport: state.viewport }))(Search)
