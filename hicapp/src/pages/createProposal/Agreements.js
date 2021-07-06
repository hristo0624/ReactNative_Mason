import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import navigationService from 'shared/navigation/service'
import SectionItemSwitch from 'shared/components/sections/SectionItemSwitch'

@withMappedNavigationParams()
class Agreements extends Component {
  constructor (props) {
    super(props)
    this.state = {
      agreements: props.agreements
    }
  }

  toggleAggrement = (agrId) => () => {
    const { agreements } = this.state
    const curIndex = _.indexOf(agreements, agrId)
    const needAdd = curIndex < 0
    const agreementsCopy = [ ...agreements ]
    if (needAdd) {
      agreementsCopy.push(agrId)
    } else {
      agreementsCopy.splice(curIndex, 1)
    }
    this.setState({ agreements: agreementsCopy })
  }

  sections = () => {
    const { agreementsDict } = this.props
    const { agreements } = this.state
    return [
      {
        title: 'AGREEMENTS',
        data: _.map(agreementsDict, agrInfo => ({
          title: agrInfo.title,
          key: agrInfo.id,
          actionField: (
            <SectionItemSwitch
              checked={_.indexOf(agreements, agrInfo.id) >= 0}
              onChange={this.toggleAggrement(agrInfo.id)}
              trackColor={AQUA_MARINE}
            />
          )
        })),
        isFirst: true
      }
    ]
  }

  save = () => {
    const { onChange } = this.props
    const { agreements } = this.state
    onChange(agreements)
    navigationService.goBack()
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
          title={{ title: 'Agreements' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Save',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
      </Page>
    )
  }
}

Agreements.propTypes = {
  agreements: PropTypes.array,
  onChange: PropTypes.func
}

const mapStateToProps = state => ({
  agreementsDict: _.get(state, 'references.agreements', {}),
  viewport: state.viewport
})

export default connect(mapStateToProps)(Agreements)
