import React from 'react'
import SectionList from 'components/sections/SectionList'

const OptionsList = ({ sectionsData }) => (
  <SectionList noHeader noMargin sections={[{ data: sectionsData }]} />
)

export default OptionsList
