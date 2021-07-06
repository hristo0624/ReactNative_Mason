import React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox="0 0 140 210" {...props}>
    <Path
      d="M97.82 166.304c.283 41.476-38.623 44.132-38.623 44.132 80.56.443 93.162-37.87 130.189-94.502M97.874 115.95l-.055 50.354"
      fill="none"
      stroke={props.color}
      strokeWidth={0.137}
    />
    <Path
      d="M189.386 115.934l-91.512.015"
      fill="none"
      stroke={props.color}
      strokeWidth={0.265}
    />
    <Path
      d="M74.755 209.802c11.113-.738 23.179-2.868 31.7-5.597 14.495-4.643 25.797-11.576 36.766-22.552 9.632-9.639 16.428-18.995 33.232-45.746 4.361-6.943 8.921-14.15 10.133-16.017 1.212-1.866 2.204-3.475 2.204-3.576 0-.102-20.369-.184-45.264-.184H98.262l-.2 27.702c-.21 29.112-.29 30.982-1.55 35.914-1.331 5.216-3.665 10.274-6.55 14.195-5.475 7.445-14.726 13.254-25.025 15.716l-1.683.403 4.067-.017c2.237-.01 5.583-.118 7.434-.241z"
      fill={props.color}
      strokeWidth={0.281}
    />
  </Svg>
)

export default SvgComponent