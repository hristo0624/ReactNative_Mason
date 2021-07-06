import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} {...props} viewBox='0 0 30 30' >
      <Defs>
        <Path
          id="prefix__a"
          d="M3 0H1.5A1.5 1.5 0 0 0 0 1.5V3a1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 0-3m6 3h3a1.5 1.5 0 0 0 0-3H9a1.5 1.5 0 0 0 0 3m12-3h-3a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m-9 27H9a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m9 0h-3a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m7.5-27H27a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 3 0V1.5A1.5 1.5 0 0 0 28.5 0m0 25.5A1.5 1.5 0 0 0 27 27a1.5 1.5 0 0 0 0 3h1.5a1.5 1.5 0 0 0 1.5-1.5V27a1.5 1.5 0 0 0-1.5-1.5M3 27a1.5 1.5 0 0 0-3 0v1.5A1.5 1.5 0 0 0 1.5 30H3a1.5 1.5 0 0 0 0-3m-1.5-4.5A1.5 1.5 0 0 0 3 21v-3a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0 1.5 1.5m0-9A1.5 1.5 0 0 0 3 12V9a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0 1.5 1.5m27 3A1.5 1.5 0 0 0 27 18v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0-1.5-1.5m0-9A1.5 1.5 0 0 0 27 9v3a1.5 1.5 0 0 0 3 0V9a1.5 1.5 0 0 0-1.5-1.5m-7.5 6h-4.5V9a1.5 1.5 0 0 0-3 0v4.5H9a1.5 1.5 0 0 0 0 3h4.5V21a1.5 1.5 0 0 0 3 0v-4.5H21a1.5 1.5 0 0 0 0-3"
        />
      </Defs>
      <Use fill={props.color} xlinkHref="#prefix__a" fillRule="evenodd" />
    </Svg>
  )
}