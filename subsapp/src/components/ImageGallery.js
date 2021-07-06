import React, { Component } from 'react'
import styled from 'styled-components'
import { View, ScrollView, TouchableWithoutFeedback, Image } from 'react-native'
import { getWidth } from 'shared/utils/dynamicSize'
import ImageViewModal from 'shared/components/modals/ImageViewModal'

const ImageElement = styled(Image)`
  width: ${props => getWidth(60, props.viewport)};
  height: ${props => getWidth(60, props.viewport)};
  margin-right: ${props => getWidth(8, props.viewport)};
`

class ImageGallery extends Component {
    state = {
      modalVisible: false,
      modalImageIndex: 0,
      images: this.props.images || []
    }

    setModalVisible(visible, imageIndex) {
      this.setState({
        modalImageIndex: imageIndex,
        modalVisible: visible
     })
    }

    closeModal = () => {
      this.setState({ modalVisible: false })
    }

    render() {
      const images = this.state.images.map((image, index) => (
        <TouchableWithoutFeedback key={index}
          onPress={() => { this.setModalVisible(true, index)}}>
          <ImageElement viewport={this.props.viewport} source={{uri: image.thumbUrl, cache: 'force-cache' }} />
        </TouchableWithoutFeedback>
      ))

      return (
        <View style={{ paddingTop: 8 }}>
          <ImageViewModal
            viewport={this.props.viewport}
            visible={this.state.modalVisible}
            onClose={this.closeModal}
            images={this.state.images}
            index={this.state.modalImageIndex}
          />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {images}
          </ScrollView>
        </View>
      )
    }
  }

  export default ImageGallery