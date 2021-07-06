import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox='0 0 26 26'>
      <G fill={props.color} fillRule='evenodd'>
        <Path
          id='prefix__a'
          d='M24.1 11.95H14.05V1.9c0-.45-.45-.9-1.05-.9-.6 0-1.05.45-1.05.9v10.05H1.9c-.45 0-.9.45-.9 1.05 0 .6.45 1.05.9 1.05h10.05V24.1c0 .45.45.9 1.05.9.6 0 1.05-.45 1.05-.9V14.05H24.1c.45 0 .9-.45.9-1.05 0-.6-.45-1.05-.9-1.05z'
        />
      </G>
    </Svg>
  )
}