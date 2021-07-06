import React from 'react'
import { connect } from 'react-redux'
import DateTimePicker from 'react-native-modal-datetime-picker'

import ModalHeader from 'shared/components/modals/ModalHeader'
import { StyledText } from 'shared/components/StyledComponents'
import { LIGHT_GREY_BLUE } from 'shared/constants/colors'

const DatePicker = ({ isVisible, onConfirm, hide, date, titleText, saveText, cancelText, ...rest }) => (
  <DateTimePicker
    isVisible={isVisible}
    onConfirm={onConfirm}
    onCancel={hide}
    confirmTextIOS={saveText}
    date={date}
    customTitleContainerIOS={<ModalHeader title={titleText} onClose={hide} />}
    customCancelButtonIOS={<StyledText customStyle={'align-self: center;'} fontSize={16} color={LIGHT_GREY_BLUE}>{cancelText}</StyledText>}
    reactNativeModalPropsIOS={{ backdropColor: '#140f26', backdropOpacity: 0.67, onBackdropPress: hide }}
    {...rest}
  />
)

export default connect(state => ({ viewport: state.viewport }))(DatePicker)
