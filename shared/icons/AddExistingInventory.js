import React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 20 20' {...props}>
    <Path
      fill={props.color}
      id="prefix__a"
      d="M20 8c0 .55-.45 1-1 1h-2v2c0 .55-.45 1-1 1s-1-.45-1-1V9h-2c-.55 0-1-.45-1-1s.45-1 1-1h2V5c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1zM4 7h3V2H4v5zm-2 9h5V9H2v7zm14-2c-.55 0-1 .45-1 1v1H9V5h3c.55 0 1-.45 1-1s-.45-1-1-1H9V1c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v6H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h15c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1z"
    />
    <Path fill="#FFF" d="M4 7h3V2H4zm-2 9h5V9H2z" />
  </Svg>
)

export default SvgComponent