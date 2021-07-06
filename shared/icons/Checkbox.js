import React from 'react'
import Svg, { G, Path, Ellipse } from 'react-native-svg'


export default function (props) {
  return (
    <Svg width={props.size} height={props.size} viewBox='0 0 32 32'>
      <G fill='none' fillRule='evenodd'>
        <Ellipse cx="16.15" cy="16.033" fill={props.color || "#18446F"} rx="15.411" ry="15.361"/>
        <Path fill="#FFF" fill-rule="nonzero" d="M13.679 21.732a1.494 1.494 0 0 0 2.121 0l7.5-7.5a1.5 1.5 0 1 0-2.121-2.12l-6.44 6.438-3.44-3.439a1.5 1.5 0 1 0-2.12 2.121l4.5 4.5z"/>
      </G>
    </Svg>
  )
}
