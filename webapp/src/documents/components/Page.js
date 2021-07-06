import React from 'react'
import styled from 'styled-components'
import { PAGE_WIDTH, PAGE_HEIGHT, FONT_SIZE } from 'constants/main'

const PageDiv = styled.div`
  background: #fff;
  padding: ${PAGE_WIDTH / FONT_SIZE / 8.5}em ${PAGE_WIDTH / FONT_SIZE / 8.5}em;
  color: #000;
  position: relative;
  width: ${PAGE_WIDTH / FONT_SIZE}em;
  /* width: 119em; */
  height: ${PAGE_HEIGHT / FONT_SIZE}em;
  font-family: 'DejaVu Serif';
  line-height: normal;
  font-weight: 400;
`
const Page = (props) => <PageDiv className='pdf-doc-box'>{props.children}</PageDiv>

export default Page
