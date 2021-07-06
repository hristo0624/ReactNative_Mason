import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox='0 0 26 26'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <Defs>
          <Path fill={props.color} fill-rule="evenodd" id="a" d="M22.8 0H6a1.2 1.2 0 0 0-1.2 1.2v3.6H1.2A1.2 1.2 0 0 0 0 6v16.8A1.2 1.2 0 0 0 1.2 24H18a1.2 1.2 0 0 0 1.2-1.2v-3.6h3.6A1.2 1.2 0 0 0 24 18V1.2A1.2 1.2 0 0 0 22.8 0zM7.2 16.8v-2.958l2.4-1.6 2.934 1.956c.478.32 1.111.255 1.514-.15L19.2 8.897l2.4 2.4V16.8H7.2zm9.6 4.8H2.4V7.2h2.4V18A1.2 1.2 0 0 0 6 19.2h10.8v2.4zM7.2 2.4h14.4v5.503l-1.552-1.551a1.199 1.199 0 0 0-1.696 0l-5.304 5.304-2.782-1.854a1.196 1.196 0 0 0-1.332 0L7.2 10.958V2.4zm5.4 6a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6"/>
      </Defs>
      <G fill="none" fill-rule="evenodd">
          <Path fill="#FFF" d="M19.2 7.2l-5.999 6L9.6 10.8 6 13.2V18h16.801v-7.2z"/>
          <G>
              <Mask id="b" fill="#fff">
                  <Use xlinkHref="#a"/>
              </Mask>
              <Use fill="#919EAC" xlinkHref="#a"/>
          </G>
      </G>
    </Svg>
  )
}