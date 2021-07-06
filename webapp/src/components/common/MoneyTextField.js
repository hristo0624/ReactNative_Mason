import React from 'react'
import { TextField } from '@shopify/polaris'
import styled from 'styled-components'

const Container = styled.div`
  .Polaris-TextField__Spinner {
    display: none
  }
`

const MoneyTextField = (props) => (
  <Container>
    <TextField
      type='number'
      prefix='$'
      {...props}
    />
  </Container>
)

export default MoneyTextField
