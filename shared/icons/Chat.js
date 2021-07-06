import React from 'react'
import Svg, { Defs, Path, G, Use } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox='0 0 17 17' {...props}>
    <Defs>
      <Path
        id="prefix__a"
        d="M8.5 0C3.813 0 0 3.813 0 8.5c0 1.469.383 2.907 1.108 4.185L.043 15.881a.85.85 0 0 0 1.076 1.075l3.196-1.065A8.455 8.455 0 0 0 8.5 17c4.687 0 8.5-3.813 8.5-8.5C17 3.813 13.187 0 8.5 0m0 15.3a6.777 6.777 0 0 1-3.629-1.057.847.847 0 0 0-.724-.088l-1.953.651.65-1.954a.848.848 0 0 0-.087-.723A6.777 6.777 0 0 1 1.7 8.5c0-3.75 3.05-6.8 6.8-6.8s6.8 3.05 6.8 6.8-3.05 6.8-6.8 6.8m0-7.65a.85.85 0 1 0 0 1.7.85.85 0 0 0 0-1.7m-3.4 0a.85.85 0 1 0 0 1.7.85.85 0 0 0 0-1.7m6.8 0a.85.85 0 1 0 0 1.7.85.85 0 0 0 0-1.7"
      />
    </Defs>
    <G fill="none" fillRule="evenodd">
      <Path
        fill="#FFF"
        d="M8.5.85A7.65 7.65 0 0 0 .85 8.5a7.61 7.61 0 0 0 1.188 4.083L.85 16.15l3.567-1.188A7.61 7.61 0 0 0 8.5 16.15a7.65 7.65 0 0 0 7.65-7.65A7.65 7.65 0 0 0 8.5.85"
      />
      <Use fill="#919EAB" xlinkHref="#prefix__a" />
    </G>
  </Svg>
)

export default SvgComponent