import React from 'react'
import { connect } from 'react-redux'
import { StatusBar } from 'react-native'
import styled from 'styled-components'
import Modal from 'react-native-modal'
import _ from 'lodash'

import { getWidth, getHeight } from 'shared/utils/dynamicSize'
import { WHITE, LIGHT_GREY_BLUE, DARK_BLUE_GREY } from 'shared/constants/colors'
import { StyledText } from 'shared/components/StyledComponents'
import ModalCloseButton from 'shared/components/buttons/ModalCloseButton'

const Wrapper = styled.View`
  justify-content: flex-end;
  flex: 1;
`
const Background = styled.View`
  border-radius: 20;
  width: 100%;
  background-color: ${WHITE};
  margin-bottom: ${props => getHeight(20, props.viewport)};
  justify-content: flex-start;
`
const Content = styled.View`
  margin-top: ${props => getHeight(props.marginTop, props.viewport)};
  margin-horizontal: ${props => props.withMargin ? getWidth(35, props.viewport) : 0};
  align-items: center;
`
const Cancel = styled.TouchableOpacity`
  /* padding-vertical: ${props => getHeight(25, props.viewport)}; */
`
const Spacer = styled.TouchableOpacity`
  padding-top: ${props => getHeight(25, props.viewport)};
`

const ModalComp = ({ viewport, isVisible, title, onClose, children, withMargin, showCancel, onModalHide, withClose, marginTop }) => {
  return (
    <Modal
      backdropColor={'#000'}
      backdropOpacity={0.4}
      onBackdropPress={onClose}
      isVisible={isVisible}
      style={{ margin: getWidth(10, viewport) }}
      onModalHide={onModalHide}
    >
      <Wrapper viewport={viewport} pointerEvents='box-none'>
        <Background viewport={viewport}>
          {withClose && <ModalCloseButton viewport={viewport} onClose={onClose} />}
          <Content viewport={viewport} withMargin={withMargin} marginTop={marginTop}>
            {!!title &&
              <StyledText
                fontSize={20}
                color={DARK_BLUE_GREY}
                bold
                style={{ marginBottom: getHeight(26, viewport) }}
              >
                {title}
              </StyledText>
            }
            {children}
            {showCancel
              ? <Cancel onPress={onClose} viewport={viewport}>
                <StyledText fontSize={16} color={LIGHT_GREY_BLUE}>Cancel</StyledText>
              </Cancel>
              : <Spacer viewport={viewport} />
            }
          </Content>
        </Background>
      </Wrapper>
    </Modal>
  )
}

ModalComp.defaultProps = {
  isVisible: false,
  withMargin: false,
  withClose: false,
  showCancel: true,
  marginTop: 50,
  title: '',
  onModalHide: () => null
}

const mapStateToProps = state => ({
  viewport: state.viewport
})
export default connect(mapStateToProps)(ModalComp)
