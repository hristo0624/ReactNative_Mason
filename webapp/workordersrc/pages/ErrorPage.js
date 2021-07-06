import React from 'react'
import config from 'src/config'
import styled from 'styled-components'

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 500px;
`

const ErrorHeaderText = styled.h2`
  font-family: CircularStd-Medium;
  font-size: 36px;
  margin-bottom: 40px;
`

const ErrorText = styled.p`
  font-family: CircularStd-Medium;
  font-size: 18px;
  margin-bottom: 10px;
`

const ContactSupport = styled.div`
  font-family: CircularStd-Medium;
  font-size: 18px;
  margin-bottom: 10px;
`

const ErrorPage = ({ desc }) => (
  <Error>
    <ErrorHeaderText>An error occurred</ErrorHeaderText>
    <ErrorText>{desc}</ErrorText>
    <ContactSupport><a href={`mailto:${config.supportEmail}`}>Contact Support</a></ContactSupport>
  </Error>
)

export default ErrorPage
