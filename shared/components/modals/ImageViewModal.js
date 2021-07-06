import React from 'react'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import ImageViewer from 'react-native-image-zoom-viewer'

import ModalCloseButton from 'shared/components/buttons/ModalCloseButton'
import ModalContent from 'shared/components/modals/ModalContent'
import { Spinner } from 'shared/components/StyledComponents'
import { getWidth } from 'shared/utils/dynamicSize'

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const ImageViewModal = ({ viewport, visible, onClose, images, index }) => {
  const loadingRender = () => (
    <Wrapper>
      <Spinner color={'white'} />
    </Wrapper>
  )
  return (
    <Modal
      visible={visible}
      style={{ margin: 0 }}
      animationIn='fadeIn'
      animationOut='fadeOut'
    >
      <ModalContent backgroundColor={'black'}>
        <ModalCloseButton
          viewport={viewport}
          onClose={onClose}
          color={'white'}
          customStyle={`
            position: absolute;
            right: ${getWidth(10, viewport)}
          `}
        />
        <ImageViewer
          imageUrls={images}
          index={index}
          transparent
          renderIndicator={() => null}
          loadingRender={loadingRender}
        />
      </ModalContent>
    </Modal>
  )
}

export default ImageViewModal
