import React from 'react'
import Svg, { G, Path, Ellipse } from 'react-native-svg'

export default function (props) {
  return (
    <Svg xmlnsXlink='http://www.w3.org/2000/svg' width={props.size} height={props.size} viewBox='0 0 24 16'>
      <G fill='none' fillRule='evenodd' stroke='#ECF2FA' strokeLinecap='round' strokeLineJoin='round' strokeWidth='.545'>
        <Path d="M.1 8C8.035.04 15.967.04 23.9 8M.1 8c7.934 7.96 15.866 7.96 23.8 0" />
        <Ellipse cx={12} cy={8} rx={4.319} ry={3.859}/>
        <Path d="M12 5.807c1.356 0 2.455.982 2.455 2.193s-1.1 2.193-2.455 2.193c-1.356 0-2.455-.982-2.455-2.193M19.076.103L5.47 15.897" />
      </G>
    </Svg>
  )
}