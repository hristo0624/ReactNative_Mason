import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 20 20' {...props}>
    <Path
      id="prefix__a"
      d="M12 14c-3.309 0-6-2.691-6-6a6.006 6.006 0 0 1 7.416-5.831l-3.123 3.124a.999.999 0 0 0 0 1.414l3 3a1.03 1.03 0 0 0 1.414 0l3.124-3.124A6.006 6.006 0 0 1 12 14m7.102-9.675a1.002 1.002 0 0 0-1.595-.246L14 7.586 12.414 6l3.507-3.507a1.001 1.001 0 0 0-.247-1.595A7.91 7.91 0 0 0 12 0C7.589 0 4 3.589 4 8c0 1.846.634 3.543 1.688 4.897L.293 18.293a.999.999 0 1 0 1.414 1.414l5.396-5.395A7.954 7.954 0 0 0 12 16c4.411 0 8-3.589 8-8 0-1.29-.303-2.526-.898-3.675"
    />
    <G fill="none" fillRule="evenodd">
      <Path
        fill="#FFF"
        d="M12 1c1.16 0 2.251.287 3.214.786L11 6l3 3 4.214-4.214C18.714 5.749 19 6.84 19 8a7 7 0 1 1-7-7"
      />
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