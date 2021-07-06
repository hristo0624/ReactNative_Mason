import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE } from 'shared/constants/colors'
import Search from 'shared/components/inputs/Search'
import { getHic } from 'shared/utils/firebaseApis'
import { getHeight } from 'shared/utils/dynamicSize'

const MAX_LENGTH = 100
const MIN_SEARCH_LENGTH = 2

class VerifyLicense extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchString: '',
      loading: false,
      searchHis: []
    }
    this.search = _.debounce(this.search, 500)
  }

  onSearchChange = (v) => {
    this.setState({ searchString: v.substring(0, MAX_LENGTH) })
    this.search(v)
  }

  search = async (text) => {
    if (text.length >= MIN_SEARCH_LENGTH) {
      this.setState({ loading: true })
      const res = await getHic(text)
      const result = this.renderCluesSubcontract(res)
      this.setState({ searchHis: result, loading: false })
    } else {
      this.setState({ searchHis: [], loading: false })
    }
  }

  renderCluesSubcontract = (array) => {
    const { viewport } = this.props
    if (array.length) {
      return array.slice(0, 15).map((item, index) => {
        const title = this.getTextForSearchResult(item)
        return {
          key: index,
          desc: title,
          onPress: () => this.onPressSearchResult(title),
          containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
        }
      })
    } else {
      return [{
        key: 'no_result',
        desc: 'Not found results',
        containerCustomStyle: `min-height: ${getHeight(50, viewport)}`
      }]
    }
  }

  onPressSearchResult = searchString => this.setState({ searchString, searchHis: [] })

  getTextForSearchResult = item => (
    `${item.name} (HIS NUMBER #${item.registration})`
  )

  sections = () => {
    const { searchString, loading, searchHis } = this.state
    return [
      {
        title: 'LICENSE LOOKUP',
        data: [
          {
            key: 'license',
            customContent: (
              <Search
                value={searchString}
                onChangeText={this.onSearchChange}
                placeholder='Lookup by name, business or license #'
                loading={loading}
              />
            )
          },
          ...searchHis
        ],
        isFirst: true
      }
    ]
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          backgroundColor={WHITE}
          title={{ title: 'Verify my license' }}
          leftButton={<BackButton />}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(VerifyLicense)
