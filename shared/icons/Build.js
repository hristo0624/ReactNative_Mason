import React from 'react'
import Svg, { Defs, Path, G, Mask, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 22 22' {...props}>
    <Path
      fill={props.color}
      d="M21.744 17.9l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3l4.3 4.3-3 3-4.4-4.3c-1.2 2.4-.7 5.4 1.3 7.4 1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
    />
  </Svg>
)

export default SvgComponent