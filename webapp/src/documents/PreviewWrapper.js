import React, { Component } from 'react'
import styled from 'styled-components'
import { PAGE_WIDTH, FONT_SIZE } from 'src/constants/main'

export const Wrapper = styled.div`
  font-size: ${props => props.fontSize || FONT_SIZE}px;
`

class PreviewWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fontSize: FONT_SIZE
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.updateFontSize)
    this.updateFontSize()
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateFontSize)
  }

  updateFontSize = () => {
    if (this.divElement) {
      const { clientWidth } = this.divElement
      const fontSize = clientWidth / PAGE_WIDTH * FONT_SIZE
      this.setState({ fontSize })
    }
  }

  onRef = divElement => {
    this.divElement = divElement
  }

  render () {
    return (
      <Wrapper
        id='document_preview'
        fontSize={this.state.fontSize}
        ref={this.onRef}
      >
        {this.props.children}
      </Wrapper>
    )
  }
}

export default PreviewWrapper
