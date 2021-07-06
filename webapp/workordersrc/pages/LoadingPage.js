import React from 'react'
import styled from 'styled-components'

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
`

const LoadingText = styled.p`
  font-family: CircularStd-Medium;
  font-size: 18px;
`

const LoadingPage = () => (
  <Loading>
    <LoadingText>Loading...</LoadingText>
  </Loading>
)

export default LoadingPage
