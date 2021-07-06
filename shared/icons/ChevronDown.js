import React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox="0 0 13 7" {...props}>
    <Path
      fill="currentColor"
      id="prefix__a"
      d="M6.5 5.343L1.387.238a.813.813 0 0 0-1.149 0 .81.81 0 0 0 0 1.147 2629.63 2629.63 0 0 0 5.113 5.106c.22.214.871.509 1.149.509.185 0 .568-.17 1.149-.51a199.058 199.058 0 0 0 5.113-5.105.81.81 0 0 0 0-1.147.813.813 0 0 0-1.149 0L6.5 5.343z"
    />
  </Svg>
)

export default SvgComponent