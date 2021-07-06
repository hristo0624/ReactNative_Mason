import React from 'react'
import Svg, { Path, Defs, G, Use, Mask } from 'react-native-svg'

export default function (props) {
  return (
    <Svg width={props.size} height={props.size} {...props} viewBox='0 0 30 30'>
      <Defs>
        <Path
          id="prefix__a"
          d="M3 0H1.5A1.5 1.5 0 0 0 0 1.5V3a1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 0-3m6 3h3a1.5 1.5 0 0 0 0-3H9a1.5 1.5 0 0 0 0 3m12-3h-3a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m-9 27H9a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m9 0h-3a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 0 0-3m7.5-27H27a1.5 1.5 0 0 0 0 3 1.5 1.5 0 0 0 3 0V1.5A1.5 1.5 0 0 0 28.5 0m0 25.5A1.5 1.5 0 0 0 27 27a1.5 1.5 0 0 0 0 3h1.5a1.5 1.5 0 0 0 1.5-1.5V27a1.5 1.5 0 0 0-1.5-1.5M3 27a1.5 1.5 0 0 0-3 0v1.5A1.5 1.5 0 0 0 1.5 30H3a1.5 1.5 0 0 0 0-3m-1.5-4.5A1.5 1.5 0 0 0 3 21v-3a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0 1.5 1.5m0-9A1.5 1.5 0 0 0 3 12V9a1.5 1.5 0 0 0-3 0v3a1.5 1.5 0 0 0 1.5 1.5m27 3A1.5 1.5 0 0 0 27 18v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0-1.5-1.5m0-9A1.5 1.5 0 0 0 27 9v3a1.5 1.5 0 0 0 3 0V9a1.5 1.5 0 0 0-1.5-1.5"
        />
        <Path
          id="prefix__c"
          d="M14.4 11.68c-1.6-1.2-3.92-1.84-5.6-2.08V5.52c1.68-.16 4-.88 5.6-2.08v8.24zM7.2 14.4H6.12l-1.64-3.2H7.2v3.2zm0-4.8H3.6c-1.12 0-2-.88-2-2s.88-2 2-2h3.6v4zm8-9.6c-.4 0-.8.4-.8.8C14.4 2.4 10.32 4 8 4H3.6C1.6 4 0 5.6 0 7.6c0 1.68 1.12 3.04 2.64 3.44l2 4c.24.56.8.96 1.44.96H7.2c.88 0 1.6-.72 1.6-1.6v-3.12c2.4.24 5.6 1.68 5.6 3.12 0 .4.4.8.8.8s.8-.4.8-.8V.8c0-.4-.4-.8-.8-.8z"
        />
      </Defs>
      <G fill="none" fillRule="evenodd">
        <Mask id="prefix__b" fill="#fff">
          <Use xlinkHref="#prefix__a" />
        </Mask>
        <Use fill={props.color} xlinkHref="#prefix__a" />
        <G fill={props.color} mask="url(#prefix__b)">
          <Path d="M0 0h32v32H0z" />
        </G>
        <G transform="translate(7 7)">
          <Path fill="#FFF" d="M7.2 9.6H3.6c-1.12 0-2-.88-2-2s.88-2 2-2h3.6v4z" />
          <Mask id="prefix__d" fill="#fff">
            <Use xlinkHref="#prefix__c" />
          </Mask>
          <Use fill={props.color} xlinkHref="#prefix__c" />
          <G fill={props.color} mask="url(#prefix__d)">
            <Path d="M0 0h17v17H0z" />
          </G>
        </G>
      </G>
    </Svg>
  )
}