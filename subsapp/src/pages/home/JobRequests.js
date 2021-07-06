import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FlatList } from  'react-native'
import _ from 'lodash'
import styled from 'styled-components'

import { getWidth, getHeight } from 'shared/utils/dynamicSize'

import JobRequest from 'components/home/JobRequest'

const mapViewportToProps = state => ({ viewport: state.viewport })

const Wrapper = styled.View`
  padding-vertical: ${props => getHeight(6, props.viewport)};
`
const SeparatorComp = styled.View`
  width: ${props => getWidth(10, props.viewport)};
  height: 100%;
`
const Separator = connect(mapViewportToProps)(SeparatorComp)

class JobRequests extends Component {
  render () {
    const { viewport } = this.props
    const insetHorizontal = getWidth(14, viewport)
    return (
      <Wrapper viewport={viewport}>
      <FlatList
         horizontal
         showsHorizontalScrollIndicator={false}
         ItemSeparatorComponent={Separator}
         data={[{key: 'a'}, {key: 'b'}]}
         renderItem={({item}) => <JobRequest key={item.key} {...item} />}
         contentInset={{ left: insetHorizontal, right: insetHorizontal }}
         contentOffset={{x: -insetHorizontal }}
        //  automaticallyAdjustContentInsets={false}
       />
       </Wrapper>
    )
  }
}

export default connect(mapViewportToProps)(JobRequests)