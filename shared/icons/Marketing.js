import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox='0 0 20 20'>
      <G fill="none" fill-rule="evenodd">
        <Path fill="#3cd0b0"  d="M18 14.6c-2-1.5-4.9-2.3-7-2.6V6.901c2.1-.2 5-1.101 7-2.601v10.3zM9 18H7.651L5.6 14H9v4zm0-6H4.5C3.1 12 2 10.901 2 9.5 2 8.1 3.1 7 4.5 7H9v5zM19 0c-.5 0-1 .5-1 1 0 2-5.1 4-8 4H4.5C2 5 0 7 0 9.5c0 2.1 1.4 3.8 3.3 4.3l2.5 5c.3.7 1 1.2 1.8 1.2H9c1.1 0 2-.9 2-2v-3.9c3 .301 7 2.101 7 3.9 0 .5.5 1 1 1s1-.5 1-1V1c0-.5-.5-1-1-1z"/>
      </G>
    </Svg>
  )
}
