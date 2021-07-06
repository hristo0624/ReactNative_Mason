import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 20 20' {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M15 2h-2.586L10.707.293A.997.997 0 0 0 10 0H6a.997.997 0 0 0-.707.293L3.586 2H1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 16H2V4h1.586l1.707 1.707A.997.997 0 0 0 6 6h4c.265 0 .52-.105.707-.293L12.414 4H14v14zM6.414 2h3.172l1 1-1 1H6.414l-1-1 1-1zm3.879 7.293L7 12.586l-1.293-1.293a.999.999 0 1 0-1.414 1.414l2 2a.997.997 0 0 0 1.414 0l4-4a.999.999 0 1 0-1.414-1.414"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path fill="#FFF" d="M14 3l-2 2H8.001L6 3H3v16h14.001V3z" />
      <G transform="translate(2)">
        <Mask id="prefix__b" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Use fill={props.color} xlinkHref="#prefix__a" />
        <G fill={props.color} mask="url(#prefix__b)">
          <Path d="M-2 0h21v21H-2z" />
        </G>
      </G>
    </G>
  </Svg>
)

export default SvgComponent
