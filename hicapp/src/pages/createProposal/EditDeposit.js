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
import { PALE_GREY, WHITE, AQUA_MARINE, DEEP_SKY_BLUE, BLACK10 } from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import navigationService from 'shared/navigation/service'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import amountType from 'shared/constants/amountType'
import { StyledText } from 'shared/components/StyledComponents'
import SelectAmountType from 'components/panels/SelectAmountType'
import { getHeight } from 'shared/utils/dynamicSize'

const HeaderContainer = styled.View`
  height: ${props => getHeight(150, props.viewport)};
  align-items: center;
  justify-content: center;
  width: 100%;
  border-bottom-width: 1;
  border-color: ${BLACK10};
`

@withMappedNavigationParams()
class EditDeposit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: _.get(props, 'deposit.value', 0),
      type: _.get(props, 'deposit.type', amountType.FLAT_AMOUNT),
      perc: _.get(props, 'deposit.perc', 0),
      typePanelVisible: false
    }
  }

  toggleTypePanel = () => this.setState({ typePanelVisible: !this.state.typePanelVisible })

  renderTypeValue = () => {
    const { type } = this.state
    let title
    if (type === amountType.PERCENTAGE) {
      title = 'Percentage (%)'
    } else {
      title = 'Flat amount ($)'
    }
    return (
      <StyledText color={DEEP_SKY_BLUE}>
        {title}
      </StyledText>
    )
  }

  handleDepositAmountChange = (v) => {
    const { projectCost } = this.props
    console.log('handleDepositAmountChanage', v, 'projectCost', projectCost)
    const { type } = this.state
    if (v === '') {
      this.setState({
        value: null,
        type,
        perc: null
      })
    } else {
      if (type === amountType.FLAT_AMOUNT) {
        let dValue = v
        if (dValue < 0) dValue = 0
        const maxPercValue = projectCost * 0.1
        if (dValue > maxPercValue) dValue = maxPercValue
        if (dValue > 1000) dValue = 1000
        this.setState({
          value: _.round(dValue, 2),
          perc: projectCost > 0 ? _.round(dValue / projectCost * 100, 2) : null
        })
      } else {
        let dValue = projectCost * v / 100
        if (dValue < 0) dValue = 0
        const maxPercValue = projectCost * 0.1
        if (dValue > maxPercValue) dValue = maxPercValue
        if (dValue > 1000) dValue = 1000
        this.setState({
          value: _.round(dValue, 2),
          perc: projectCost > 0 ? _.round(dValue / projectCost * 100, 2) : null
        })
      }
    }
  }

  renderActionField = () => {
    const { value, type, perc } = this.state
    const blurValue = type === amountType.PERCENTAGE ? `${perc}%` : moneyWithSymbolAbbr(value)

    return (
      <SectionItemInput
        value={amountType.PERCENTAGE ? _.toString(perc || 0) : _.toString(value || 0)}
        onComplete={this.handleDepositAmountChange}
        keyboardType='numeric'
        blurValue={blurValue}
      />
    )
  }

  renderInputs = () => {
    const { value, type } = this.state
    if (type === amountType.PERCENTAGE) {
      return [
        {
          title: 'Set percentage',
          desc: 'max 10% or $1000',
          key: 'percentage',
          actionField: this.renderActionField()
        },
        {
          title: 'Deposit amount',
          key: 'amount',
          disabled: true,
          actionField: (
            <SectionItemInput
              value={moneyWithSymbolAbbr(value)}
              onComplete={() => null}
              blurValue={moneyWithSymbolAbbr(value)}
              disabled
            />
          )
        }
      ]
    } else {
      return [
        {
          title: 'Deposit amount',
          desc: 'max 10% or $1000',
          key: 'amount',
          actionField: this.renderActionField()
        }
      ]
    }
  }

  renderHeader = () => {
    const { projectCost, viewport } = this.props
    return (
      <HeaderContainer viewport={viewport}>
        <StyledText fontSize={16}>Contract amount</StyledText>
        <StyledText fontSize={36}>
          {moneyWithSymbolAbbr(projectCost)}
        </StyledText>
      </HeaderContainer>
    )
  }

  sections = () => {
    const res = [
      {
        customHeader: this.renderHeader(),
        data: [
          {
            title: 'Deposit',
            key: 'deposit',
            actionField: this.renderTypeValue(),
            onPress: this.toggleTypePanel
          },
          ...this.renderInputs()
        ]
      }
    ]
    return res
  }

  renderTitle = () => {
    const { value } = this.state
    if (value > 0) {
      return (
        <TitleWithDesc
          title={'Edit deposit'}
          desc={moneyWithSymbolAbbr(value)}
        />
      )
    } else {
      return {
        title: 'Edit deposit'
      }
    }
  }

  save = () => {
    console.log('save')
    const { value, type, perc } = this.state
    const { onSave } = this.props
    onSave({ value, type, perc })
    navigationService.goBack()
  }

  onDepositAmountTypeChange = (v) => {
    this.setState({
      value: 0,
      perc: 0,
      type: v,
      typePanelVisible: false
    })
  }

  renderTypeSelectorPanel = () => {
    const { type, typePanelVisible } = this.state
    return (
      <SelectAmountType
        value={type}
        visible={typePanelVisible}
        onSelect={this.onDepositAmountTypeChange}
        onClose={this.toggleTypePanel}
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
        {this.renderTypeSelectorPanel()}
      </Page>
    )
  }
}

EditDeposit.propTypes = {
  projectCost: PropTypes.number,
  deposit: PropTypes.object,
  save: PropTypes.func
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(EditDeposit)
