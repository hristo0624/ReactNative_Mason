import React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgComponent = props => (
  <Svg width={props.size} height={props.size} viewBox="0 0 140 210" {...props}>
    <Path
      d="M150.817 166.304c-.284 41.476 38.622 44.132 38.622 44.132-80.56.443-93.162-37.87-130.19-94.502M150.762 115.95l.055 50.354"
      fill="none"
      stroke={props.color}
      strokeWidth={0.137}
    />
    <Path
      d="M59.25 115.934l91.512.015"
      fill="none"
      stroke={props.color}
      strokeWidth={0.265}
    />
    <Path
      d="M173.88 209.802c-11.112-.738-23.178-2.868-31.699-5.597-14.495-4.643-25.798-11.576-36.766-22.552-9.632-9.639-16.428-18.995-33.232-45.746-4.361-6.943-8.921-14.15-10.133-16.017-1.212-1.866-2.204-3.475-2.204-3.576 0-.102 20.369-.184 45.264-.184h45.264l.2 27.702c.21 29.112.29 30.982 1.55 35.914 1.331 5.216 3.665 10.274 6.55 14.195 5.475 7.445 14.726 13.254 25.025 15.716l1.683.403-4.067-.017c-2.238-.01-5.583-.118-7.434-.241z"
      strokeWidth={1.06}
      fill={props.color}
    />
  </Svg>
)

export default SvgComponent
