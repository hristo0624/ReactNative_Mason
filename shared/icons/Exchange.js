import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 20 20' {...props}>
    <Path
      id="prefix__a"
      d="M17.986 13.166a3 3 0 1 1-1.973 0A1.007 1.007 0 0 1 16 13V8.999A3.999 3.999 0 0 0 12.001 5h-.587l1.293 1.293a1 1 0 1 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 1.414L11.414 3h.587A5.999 5.999 0 0 1 18 8.999V13c0 .057-.005.112-.014.166zm-14-6.332c.01.054.014.11.014.166v4.001A3.999 3.999 0 0 0 7.999 15h.587l-1.293-1.293a1 1 0 0 1 1.414-1.414l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 1 1-1.414-1.414L8.586 17h-.587A5.999 5.999 0 0 1 2 11.001V7c0-.057.005-.112.014-.166a3 3 0 1 1 1.973 0zM4 4a1 1 0 1 0-2.001.001A1 1 0 0 0 4 4zm14 12a1 1 0 1 0-2.001.001A1 1 0 0 0 18 16z"
    />
    <G fill="none" fillRule="evenodd">
      <Path
        fill="#FFF"
        d="M4 3a2 2 0 1 1-4.001-.001A2 2 0 0 1 4 3zm14 12a2 2 0 1 1-4.001-.001A2 2 0 0 1 18 15z"
      />
      <Mask id="prefix__b" fill="#fff">
        <Use href="#prefix__a" xlinkHref="#prefix__a" />
      </Mask>
      <Use fill={props.color} fillRule="nonzero" href="#prefix__a" xlinkHref="#prefix__a" />
      <G fill={props.color} mask="url(#prefix__b)">
        <Path d="M0 0h21v21H0z" />
      </G>
    </G>
  </Svg>
)

export default SvgComponent