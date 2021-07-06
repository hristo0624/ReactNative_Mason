import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { AQUA_MARINE, BLACK10, PALE_GREY, WHITE } from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import navigationService from 'shared/navigation/service'
import { StyledText } from 'shared/components/StyledComponents'
import { getHeight } from 'shared/utils/dynamicSize'
import SectionItemSwitch from 'shared/components/sections/SectionItemSwitch'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'

const HeaderContainer = styled.View`
  height: ${props => getHeight(150, props.viewport)};
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom-width: 1;
  border-color: ${BLACK10};
`

@withMappedNavigationParams()
class AmountToFinance extends Component {
  constructor (props) {
    super(props)
    this.state = {
      amountToFinance: props.amountToFinance
    }
  }

  renderHeader = () => {
    const { balanceDue, viewport } = this.props
    return (
      <HeaderContainer viewport={viewport}>
        <StyledText fontSize={16}>Balance due</StyledText>
        <StyledText fontSize={36}>
          {moneyWithSymbolAbbr(balanceDue)}
        </StyledText>
      </HeaderContainer>
    )
  }

  toggleSwitch = () => {
    const { amountToFinance } = this.state
    const { balanceDue } = this.props
    this.setState({
      amountToFinance: _.isNil(amountToFinance) ? balanceDue : null
    })
  }

  handleAmountOfFinanceChange = (v) => {
    const { balanceDue } = this.props
    if (v !== '') {
      let res = '0'
      let amount = _.round(v, 2)
      if (_.isNaN(amount)) amount = 0
      console.log('amount row', v, 'rounded', amount)
      if (amount > balanceDue) {
        res = _.toString(balanceDue)
      } else if (amount < 0) {
        res = '0'
      } else {
        res = _.toString(amount)
      }
      this.setState({ amountToFinance: res })
    } else {
      this.setState({ amountToFinance: v })
    }
  }

  sections = () => {
    const { balanceDue } = this.props
    const { amountToFinance } = this.state
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    const res = [
      {
        customHeader: this.renderHeader(),
        data: [
          {
            title: 'Same as balance due?',
            key: 'switch',
            actionField: (
              <SectionItemSwitch
                checked={_.isNil(amountToFinance)}
                onChange={this.toggleSwitch}
              />
            )
          },
          {
            title: 'Amount to finance',
            key: 'amount',
            disabled: _.isNil(amountToFinance),
            actionField: (
              <SectionItemInput
                value={_.toString(amountToFinance)}
                disabled={_.isNil(amountToFinance)}
                blurValue={moneyWithSymbolAbbr(realAmountToFinance)}
                onChange={this.handleAmountOfFinanceChange}
                keyboardType='decimal-pad'
              />
            )
          }

        ]
      }
    ]
    return res
  }

  save = () => {
    console.log('save')
    const { amountToFinance } = this.state
    const { save } = this.props
    let res = amountToFinance
    if (res === '') {
      res = 0
    } else if (!_.isNil(res)) {
      res = _.round(res, 2)
    }
    save(res)
    navigationService.goBack()
  }

  renderTitle = () => {
    const { amountToFinance } = this.state
    const { balanceDue } = this.props
    const realAmountToFinance = _.isNil(amountToFinance) ? balanceDue : amountToFinance
    return (
      <TitleWithDesc
        title={'Amount to finance'}
        desc={moneyWithSymbolAbbr(realAmountToFinance)}
      />
    )
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
          title={this.renderTitle()}
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

AmountToFinance.propTypes = {
  amountToFinance: PropTypes.number,
  balanceDue: PropTypes.number,
  save: PropTypes.func
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(AmountToFinance)
