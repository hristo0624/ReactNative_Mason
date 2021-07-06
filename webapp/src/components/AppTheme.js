import styled from 'styled-components'

import {
  AQUA_MARINE,
  LIGHT_NAVY,
  LIGHT_NAVY_D1,
  LIGHT_NAVY_D2,
  LIGHT_NAVY_D3,
  LIGHT_NAVY_D4,
  LIGHT_NAVY_D5,
  LIGHT_NAVY_D6,
  LIGHT_NAVY_L1,
  LIGHT_NAVY_L2,
  BLACK_TR,
  WHITE
} from 'constants/colors'

const AppTheme = styled.div`
  /* avatar */
  .Polaris-Avatar {
    background: ${AQUA_MARINE}
  }

  /* button primary */
  .Polaris-Button--primary {
    background: ${`linear-gradient(to bottom, ${LIGHT_NAVY}, ${LIGHT_NAVY_D2})`};
    border-color: ${LIGHT_NAVY_D4};
    box-shadow: ${`inset 0 1px 0 0 ${LIGHT_NAVY_L1}, 0 1px 0 0 ${BLACK_TR}, 0 0 0 0 transparent`};
    color: ${WHITE};}
  .Polaris-Button--primary:hover{
    background: ${`linear-gradient(to bottom, ${LIGHT_NAVY_D1}, ${LIGHT_NAVY_D3})`};
    border-color: ${LIGHT_NAVY_D4};
    color: ${WHITE};}
  .Polaris-Button--primary:focus{
    border-color: ${LIGHT_NAVY_D6};
    box-shadow: ${`inset 0 1px 0 0 ${LIGHT_NAVY_L2}, 0 1px 0 0 ${BLACK_TR}, 0 0 0 1px ${LIGHT_NAVY_D6};`} }
  .Polaris-Button--primary:active{
    background: ${`linear-gradient(to bottom, ${LIGHT_NAVY_D4}, ${LIGHT_NAVY_D4})`};
    border-color: ${LIGHT_NAVY_D5};
    box-shadow: ${`inset 0 0 0 0 transparent, 0 1px 0 0 ${BLACK_TR}, 0 0 1px 0 ${LIGHT_NAVY_D5};`} }
  .Polaris-Button--primary svg{
    fill: ${WHITE}; }
  .Polaris-Button--primary.Polaris-Button--disabled{
    background:linear-gradient(to bottom, #bac0e6, #bac0e6);
    border-color:#a7aedf;
    box-shadow:none;
    color: ${WHITE}; }
  .Polaris-Button--primary.Polaris-Button--disabled svg{
    fill: ${WHITE}; }

  /* navigation */
  .Polaris-Navigation__Item:focus{
    color:${LIGHT_NAVY}; }
  .Polaris-Navigation__Item:focus .Polaris-Navigation__Icon{
    color:white; }
  .Polaris-Navigation__Item:focus .Polaris-Navigation__Icon svg{
    fill:${LIGHT_NAVY}; }
  .Polaris-Navigation__Item--selected{
    font-weight:600;
    color:${LIGHT_NAVY}; }
  .Polaris-Navigation__Item--selected .Polaris-Navigation__Icon,
  .Polaris-Navigation__Item--selected:focus .Polaris-Navigation__Icon{
    color:white; }
  .Polaris-Navigation__Item--selected .Polaris-Navigation__Icon svg,
  .Polaris-Navigation__Item--selected:focus .Polaris-Navigation__Icon svg{
    fill:${LIGHT_NAVY}; }
  .Polaris-Navigation__Item--selected:hover{
    color:${LIGHT_NAVY}; }
  .Polaris-Navigation__Item--selected .Polaris-Navigation__Icon svg,
  .Polaris-Navigation__Item--selected:hover .Polaris-Navigation__Icon svg,
  .Polaris-Navigation--subNavigationActive .Polaris-Navigation__Icon svg,
  .Polaris-Navigation--subNavigationActive:hover .Polaris-Navigation__Icon svg,
  .Polaris-Navigation--subNavigationActive:focus .Polaris-Navigation__Icon svg{
    fill:${LIGHT_NAVY}; }
`
export default AppTheme
