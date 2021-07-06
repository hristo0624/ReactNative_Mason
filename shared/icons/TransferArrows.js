import React from 'react'
import Svg, { G, Path } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 38 38' {...props}>
    <G fill={props.color} fillRule="evenodd">
      <Path d="M9.627 35.006l24.3-24.428 2.546 2.559-24.3 24.428zm-8.1-11.762l21.6-21.714 2.546 2.559-21.6 21.714z" />
      <Path d="M37 22.843h-3.6l.018-9.194-9.146.018v-3.62H37zM1 13.538h3.6l-.018 9.194 9.146-.018v3.62H1z" />
    </G>
  </Svg>
)

export default SvgComponent