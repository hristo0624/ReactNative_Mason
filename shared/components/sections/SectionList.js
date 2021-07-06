import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {KeyboardAwareSectionList} from 'react-native-keyboard-aware-scroll-view'
import _ from 'lodash'

import SectionHeader from 'shared/components/sections/SectionHeader'
import SectionItem from 'shared/components/sections/SectionItem'

import {BLACK10} from 'shared/constants/colors'

const StyledKeyboardAwareSectionList = styled(KeyboardAwareSectionList)`
  width: 100%;
`
const Footer = styled.View`
  width: 100%;
  border-top-width: ${props => props.noBorder ? 0 : 1};
  border-color: ${BLACK10};
`

class CommonSectionList extends Component {
  renderSectionHeader = ({section}) => {
    if (this.props.noHeader || section.noHeader) {
      return null
    }
    if (section.customHeader) {
      return section.customHeader
    }
    const {viewport} = this.props
    return (
      <SectionHeader
        title={section.title}
        viewport={viewport}
        isFirst={section.isFirst}
        height={section.height}
        noBorder={section.noBorder}
      />
    )
  }

  renderSectionFooter = ({section}) => {
    const {noBorder} = section
    return (
      <Footer noBorder={noBorder}>
        {section.footer}
      </Footer>
    )
  }

  renderItem = ({item, index, section}) => {
    const {viewport, noMargin} = this.props
    const data = _.get(section, 'data', [])
    const showBorder = _.isNil(item.showBorder) ? index !== data.length - 1 : item.showBorder
    return (
      <SectionItem
        noAction={item.noAction}
        customTitleColor={item.customTitleColor}
        title={item.title}
        wrapperCustomStyle={item.wrapperCustomStyle}
        addNewField={item.addNewField}
        viewport={viewport}
        showBorder={showBorder}
        desc={item.desc}
        actionField={item.actionField}
        onPress={item.onPress}
        disabled={item.disabled}
        customContent={item.customContent}
        onSwipeLeft={item.onSwipeLeft}
        onSwipeRight={item.onSwipeRight}
        backgroundColor={item.backgroundColor}
        gradient={item.gradient}
        error={item.error}
        noMargin={noMargin || item.noMargin}
        inputRef={item.inputRef}
        containerCustomStyle={item.containerCustomStyle}
        notClickable={item.notClickable}
        wallet={item.wallet}
        customImage={item.customImage}
      />
    )
  }

  render () {
    const {sections, scrollEnabled, keyboardShouldPersistTaps} = this.props
    return (
      <StyledKeyboardAwareSectionList
        stickySectionHeadersEnabled={false}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        renderSectionFooter={this.renderSectionFooter}
        sections={sections}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        enableOnAndroid
      />
    )
  }
}

CommonSectionList.defaultProps = {
  sections: [],
  keyboardShouldPersistTaps: 'always',
  scrollEnabled: true,
  noHeader: false,
  noBorder: false,
  noMargin: false
}

CommonSectionList.propTypes = {
  keyboardShouldPersistTaps: PropTypes.string,
  scrollEnabled: PropTypes.bool,
  viewport: PropTypes.object.isRequired,
  noHeader: PropTypes.bool,
  noBorder: PropTypes.bool,
  noMargin: PropTypes.bool,
  sections: PropTypes.array
}

export default connect(state => ({viewport: state.viewport}))(CommonSectionList)
