import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 20 20' {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M11 13c-1.103 0-2-.897-2-2V4h5.185A2.995 2.995 0 0 0 17 6c1.654 0 3-1.346 3-3s-1.346-3-3-3a2.997 2.997 0 0 0-2.816 2H5.816A2.997 2.997 0 0 0 3 0C1.346 0 0 1.346 0 3s1.346 3 3 3a2.997 2.997 0 0 0 2.816-2H7v7c0 2.206 1.794 4 4 4a1 1 0 1 0 0-2m5.977-2c.026.001.649.04 1.316.707a.999.999 0 1 0 1.414-1.414A4.491 4.491 0 0 0 18 9.2V9a1 1 0 1 0-2 0v.185A2.995 2.995 0 0 0 14 12c0 2.281 1.727 2.712 2.758 2.97C17.873 15.249 18 15.354 18 16c0 .552-.448 1-.976 1-.026-.001-.65-.04-1.317-.707a.999.999 0 1 0-1.414 1.414A4.506 4.506 0 0 0 16 18.8v.2a1 1 0 1 0 2 0v-.185A2.993 2.993 0 0 0 20 16c0-2.281-1.726-2.712-2.757-2.97C16.128 12.751 16 12.646 16 12c0-.552.449-1 .977-1M3 4a1.001 1.001 0 0 1 0-2 1.001 1.001 0 0 1 0 2m14-2a1.001 1.001 0 0 1 0 2 1.001 1.001 0 0 1 0-2"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Mask id="prefix__b" fill="#fff">
        <Use xlinkHref="#prefix__a" />
      </Mask>
      <Use fill={props.color} xlinkHref="#prefix__a" />
      <G fill={props.color} mask="url(#prefix__b)">
        <Path d="M0 0h21v21H0z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent