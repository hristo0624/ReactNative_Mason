import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import generate from 'firebase-auto-ids'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { AQUA_MARINE, CORAL, PALE_GREY, WHITE } from 'shared/constants/colors'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import { CURRENCY_SYMBOL } from 'constants/index'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import navigationService from 'shared/navigation/service'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import SectionDeleteButton from 'shared/components/sections/SectionDeleteButton'
import ConfirmationModal from 'shared/components/modals/ConfirmationModal'
import SectionTextarea from 'shared/components/sections/SectionTextarea'

@withMappedNavigationParams()
class CreateLineItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: _.get(props, 'item.id', generate(_.now())),
      name: _.get(props, 'item.name', ''),
      desc: _.get(props, 'item.desc', ''),
      quantity: _.get(props, 'item.quantity', null),
      cost: _.get(props, 'item.cost', null),
      nameError: null
    }
  }

  handleChangeName = (name) => {
    this.setState({
      name,
      nameError: null
    })
  }

  handleChangeQuantity = (v) => {
    let quantity = v
    if (quantity !== '') {
      let quantity = Number(v).toFixed(0)
      if (isNaN(quantity) || quantity <= 0) quantity = 1
    }
    this.setState({ quantity: quantity })
  }

  handleChangeCost = (v) => this.setState({ cost: v })

  handleCompleteCost = (v) => {
    if (v !== '') {
      let res = parseFloat(v).toFixed(2)
      if (isNaN(res) || res <= 0) res = 0
      this.setState({ cost: res })
    } else {
      this.setState({ cost: null })
    }
  }

  renderDeleteButton = () => {
    return <SectionDeleteButton title={'Delete'} color={CORAL} />
  }

  showPrompt = () => this.setState({ deletePromptVisible: true })
  hideModal = () => this.setState({ deletePromptVisible: false })

  handleDelete = () => {
    const { id } = this.state
    const { delItem } = this.props
    delItem(id)
    this.hideModal()
    navigationService.goBack()
  }

  renderDeletePromptModal = () => {
    const { deletePromptVisible } = this.state
    return (
      <ConfirmationModal
        title={'Delete line item?'}
        onReject={this.handleDelete}
        onApply={this.hideModal}
        onClose={this.hideModal}
        positiveTitle='cancel'
        negativeTitle='delete'
        isVisible={deletePromptVisible}
        showCancel={false}
      />
    )
  }

  handleChangeDesc = (v) => {
    console.log('handleChangeDesc', v)
    this.setState({ desc: v })
  }

  sections = () => {
    const { item } = this.props
    const { name, nameError, quantity, cost, desc } = this.state
    const res = [
      {
        data: [
          {
            title: 'Line item name',
            key: 'name',
            error: nameError,
            actionField: (
              <SectionItemInput
                value={name}
                placeholder={'Flooring'}
                onChange={this.handleChangeName}
              />
            )
          },
          {
            title: 'Description',
            key: 'desc',
            customContent: (
              <SectionTextarea
                placeholder='Line item description'
                value={desc}
                onChangeText={this.handleChangeDesc}
              />
            )
          },
          {
            title: 'Quantity',
            key: 'quantity',
            desc: '(optional)',
            actionField: (
              <SectionItemInput
                value={quantity ? quantity.toString() : ''}
                onChange={this.handleChangeQuantity}
                onComplete={this.handleChangeQuantity}
                keyboardType='numeric'
              />
            )
          },
          {
            title: 'Cost',
            key: 'cost',
            desc: '(optional)',
            actionField: (
              <SectionItemInput
                value={cost ? cost.toString() : ''}
                onChange={this.handleChangeCost}
                onComplete={this.handleCompleteCost}
                keyboardType='numeric'
                blurValue={cost ? moneyWithSymbolAbbr(cost, CURRENCY_SYMBOL) : ''}
              />
            )
          }
        ]
      }
    ]
    if (item) {
      res.push({
        data: [
          {
            customContent: this.renderDeleteButton(),
            key: 'delete',
            onPress: this.showPrompt,
            showBorder: false
          }
        ]
      })
    }
    return res
  }

  add = () => {
    console.log('add')
    const { id, name, quantity, cost, desc } = this.state
    const { addItem } = this.props
    if (name !== '') {
      addItem({
        id,
        name,
        quantity: quantity || 1,
        cost: cost || 0,
        desc
      })
      navigationService.goBack()
    } else {
      this.setState({
        nameError: 'Name cannot be blank'
      })
    }
  }

  renderTitle = () => {
    const { item } = this.props
    const { quantity, cost } = this.state
    if (cost && cost > 0) {
      const qty = quantity || 1
      const total = qty * cost
      return (
        <TitleWithDesc
          title={item ? 'Edit line item' : 'Add line item'}
          desc={moneyWithSymbolAbbr(total, CURRENCY_SYMBOL)}
        />
      )
    } else {
      return {
        title: item ? 'Edit line item' : 'Add line item'
      }
    }
  }

  render () {
    const { item } = this.props
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
            title: item ? 'Save' : 'Add',
            handler: this.add
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderDeletePromptModal()}
      </Page>
    )
  }
}

CreateLineItem.propTypes = {
  addItem: PropTypes.func,
  delItem: PropTypes.func
}

const mapStateToProps = (state) => ({
  viewport: state.viewport
})

export default connect(mapStateToProps)(CreateLineItem)
