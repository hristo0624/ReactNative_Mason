import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Linking, View } from 'react-native'
import _ from 'lodash'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import { WHITE, DARK, DEEP_SKY_BLUE, DUSK_TWO, PALE_GREY } from 'shared/constants/colors'
import PlainButton from 'shared/components/buttons/PlainButton'
import { updateAgreements } from 'controllers/project'
import { StyledText } from 'shared/components/StyledComponents'
import SectionList from 'shared/components/sections/SectionList'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import {
  getAmountToFinance,
  getBalanceDue,
  getNonFinancedAmount,
  getProgressPaymentsSum
} from 'shared/utils/proposal'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import MapModal from 'shared/components/modals/MapModal'
import ProjectActions, { actions } from 'components/panels/ProjectActions'
import ProjectPageTitle from 'pages/project/ProjectPageTitle'
import { cutString } from 'shared/utils/stringUtils'

class ProjectInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addressModalVisible: false,
      actionsModalVisible: false
    }
  }

  toggleAddressModal = () => this.setState({ addressModalVisible: !this.state.addressModalVisible })
  toggleActionsModal = () => this.setState({ actionsModalVisible: !this.state.actionsModalVisible })

  onCreateChangeOrder = () => {
    console.log('on create chnage order')
  }

  renderMapModal = () => {
    const { project } = this.props
    const { addressModalVisible } = this.state
    const address = _.get(project, 'address.description', '')
    return (
      <MapModal
        key={_.get(project, 'id', 'defaultKey')}
        visible={addressModalVisible}
        onClose={this.toggleAddressModal}
        address={address}
        location={_.get(project, 'address.location')}
        placeId={_.get(project, 'address.placeId')}
      />
    )
  }

  toCreateWorkOrder = () => navigationService.push(screens.CREATE_WORK_ORDER)

  onAction = (action) => {
    console.log('onAction', action)
    switch (action) {
      case (actions.CREATE_PROPOSAL):
        navigationService.push(screens.CREATE_PROPOSAL)
        break
      case (actions.ADD_WORK_ORDER):
        this.toCreateWorkOrder()
        break
    }
  }

  renderActionsModal = () => {
    const { actionsModalVisible } = this.state
    return (
      <ProjectActions
        visible={actionsModalVisible}
        onClose={this.toggleActionsModal}
        onSelect={this.onAction}
      />
    )
  }

  dialOwner = () => {
    const { project } = this.props
    const phone = _.get(project, 'owner.phone')
    console.log('dial phone', phone)
    const phoneInfo = parsePhoneNumberFromString('+1' + phone)
    // console.log('parsePhoneNumberFromString', parsePhoneNumberFromString)
    // console.log('phoneInfo', phoneInfo)
    console.log('phone uri:,', phoneInfo.getURI())
    if (phoneInfo.isValid()) {
      Linking.openURL(phoneInfo.getURI())
    }
  }

  renderLineItems = () => {
    const { project } = this.props
    const lineItems = _.get(project, 'lineItems', {})
    return _.map(lineItems, (item, itemId) => {
      const quantity = _.get(item, 'quantity', 1)
      const cost = _.get(item, 'cost', 0)
      const desc = `${quantity} x ${moneyWithSymbolAbbr(cost)}`
      return {
        title: item.name,
        key: itemId,
        desc: cost > 0 ? desc : null,
        actionField: <View />,
        notClickable: true
      }
    })
  }

  toScheduleOfProgressPayments = () => {
    console.log('to schedule of progress payments')
    const { project } = this.props
    const options = {
      progressPayments: _.get(project, 'progressPayments', {}),
      nonFinancedAmount: getNonFinancedAmount(project),
      editable: false
    }
    navigationService.push(screens.SCHEDULE_OF_PROGRESS_PAYMENTS, options)
  }

  progressPaymentsRow = () => {
    const { project } = this.props
    const balanceDue = getBalanceDue(project)
    const amountToFinance = _.get(project, 'amountToFinance')
    if (!_.isNil(amountToFinance) && amountToFinance < balanceDue) {
      const progressPayments = _.get(project, 'progressPayments', {})
      const nonFinancedAmount = getNonFinancedAmount(project)
      const progressPaymentsSum = getProgressPaymentsSum(progressPayments)
      const defaultItemCost = nonFinancedAmount - progressPaymentsSum
      let itemsCount = _.size(progressPayments)
      if (defaultItemCost > 0) itemsCount = itemsCount + 1

      return [{
        title: 'Schedule of progress payments',
        key: 'progressPayments',
        desc: `${itemsCount} ${itemsCount === 1 ? 'item' : 'items'}`,
        onPress: this.toScheduleOfProgressPayments
      }]
    } else {
      return []
    }
  }

  projectPeopleRows = () => {
    const { project, user, account, roles } = this.props
    const admins = _.get(project, 'admins', {})
    const res = []
    for (const adminId in admins) {
      if (adminId !== user.id) {
        const adm = _.get(account, ['admins', adminId])
        if (adm) {
          res.push({
            title: _.get(adm, 'name', _.get(adm, 'email', '')),
            key: adminId,
            desc: _.get(roles, [adm.role, 'title']),
            onPress: this.onAddPeople
          })
        }
      }
    }
    return res
  }

  onAddPeople = () => navigationService.push(screens.PROJECT_ADMINS)

  onAgreementsChange = (agreements) => {
    const { dispatch } = this.props
    dispatch(updateAgreements(agreements))
    // console.log('onAgreementsChange', agreements)
  }

  toAgreements = () => {
    const { project } = this.props
    const agreements = _.get(project, 'agreements', [])
    const options = {
      agreements,
      onChange: this.onAgreementsChange
    }
    navigationService.push(screens.AGREEMENTS, options)
  }

  agreementsSection = () => {
    // const { proposal } = this.state
    const { agreementsDict, project } = this.props
    const agreements = _.get(project, 'agreements')
    const items = _.map(agreements, agrId => ({
      title: _.get(agreementsDict, [agrId, 'title']),
      key: agrId,
      onPress: this.toAgreements
    }))
    if (items.length < _.size(agreementsDict)) {
      items.push({
        title: 'Add agreement',
        key: 'newAgreement',
        onPress: this.toAgreements,
        addNewField: true
      })
    }
    return {
      title: 'AGREEMENTS',
      data: items
    }
  }

  renderContent = () => {
    const { project } = this.props
    const ownerName = `${_.get(project, 'owner.firstName', '')} ${_.get(project, 'owner.lastName', '')}`
    const address = _.get(project, 'address.description')
    const mailingAddressSame = _.get(project, 'owner.mailingAddressSame', false)
    const mailingAddress = mailingAddressSame ? address : _.get(project, 'owner.mailingAddress.description')
    const projectCost = _.get(project, 'projectCost', 0)
    const planAmount = _.get(project, 'plan.amount', 0)
    const amountToFinance = getAmountToFinance(project)
    const ppm = planAmount > 0 ? amountToFinance / planAmount : null
    const planPaidAmount = 0
    return (
      <SectionList
        sections={[
          {
            title: 'PROJECT ADDRESS',
            data: [
              {
                title: 'Project address',
                desc: address,
                key: 0,
                onPress: this.toggleAddressModal
              }
            ]
          },
          {
            title: 'HOMEOWNER INFO',
            data: [
              {
                title: 'Homeowner name',
                key: 'ownerName',
                actionField: <StyledText color={DARK}>{ownerName}</StyledText>,
                notClickable: true
              },
              {
                title: 'Email',
                key: 'email',
                actionField: <StyledText color={DARK}>{_.get(project, 'owner.email')}</StyledText>,
                notClickable: true
              },
              {
                title: 'Contact mailing address',
                desc: mailingAddress,
                key: 'mailingAddress'
              },
              {
                title: 'Contact phone',
                key: 'phone',
                onPress: this.dialOwner,
                actionField: (
                  <PlainButton
                    color={DEEP_SKY_BLUE}
                    // customStyle={`color: ${DEEP_SKY_BLUE};`}
                    title={_.get(project, 'owner.phone')}
                    onPress={this.dialOwner}
                  />
                )
              }
            ]
          },
          {
            title: 'SCOPE OF WORK',
            data: [
              ...this.renderLineItems(),
              {
                title: 'Create change order',
                key: 'createChangeOrder',
                onPress: this.onCreateChangeOrder,
                addNewField: true
              }
            ]
          },
          {
            title: 'CONTRACT DETAILS',
            data: [
              {
                title: 'Contract amount',
                key: 'projectCost',
                notClickable: true,
                actionField: <StyledText color={DARK}>{moneyWithSymbolAbbr(projectCost)}</StyledText>
              },
              {
                title: 'Payment plan',
                key: 'paymentPlan',
                notClickable: true,
                actionField: (
                  <View>
                    { planAmount > 0
                      ? <StyledText
                        color={DARK}
                        customStyle='text-align: right;'
                      >
                        {`${planAmount} monthly payments`}
                      </StyledText>
                      : null
                    }
                    { ppm
                      ? <StyledText
                        color={DUSK_TWO}
                        customStyle='text-align: right; opacity: 0.3;'
                        fontSize={12}

                      >
                        {`of ${moneyWithSymbolAbbr(ppm)}`}
                      </StyledText>
                      : null
                    }
                  </View>
                )
              },
              {
                title: 'Paid to date',
                key: 'paid',
                desc: `0 / ${planAmount} payments`,
                notClickable: true,
                actionField: (
                  <View>
                    { planAmount > 0
                      ? <StyledText
                        color={DARK}
                        customStyle='text-align: right;'
                      >
                        {moneyWithSymbolAbbr(planPaidAmount)}
                      </StyledText>
                      : null
                    }
                    { ppm
                      ? <StyledText
                        color={DUSK_TWO}
                        customStyle='text-align: right; opacity: 0.3;'
                        fontSize={12}

                      >
                        {`of ${moneyWithSymbolAbbr(amountToFinance)}`}
                      </StyledText>
                      : null
                    }
                  </View>
                )
              },
              ...this.progressPaymentsRow()
            ]
          },
          {
            title: 'PEOPLE',
            data: [
              ...this.projectPeopleRows(),
              {
                title: 'Add someone to this project',
                key: 'addPeople',
                onPress: this.onAddPeople,
                addNewField: true
              }
            ]
          },
          this.agreementsSection()
        ]}
      />
    )
  }

  renderLeftButton = () => {
    const { viewport, project } = this.props
    const address = cutString(_.get(project, 'address.name', ''), 20)
    return (
      <ProjectPageTitle
        viewport={viewport}
        title={address}
        onPress={this.onTitlePress}
      />
    )
  }

  render () {
    const { project } = this.props
    return (
      <Page
        statusBarColor={'white'}
        statusBarStyle='dark-content'
        backgroundColor={PALE_GREY}
      >
        <NavBar
          title={{ title: cutString(`Project info - ${_.get(project, 'address.name', '')}`, 40) }}
          leftButton={<BackButton />}
          backgroundColor={WHITE}
        />
        {this.renderContent()}
        {this.renderMapModal()}
        {this.renderActionsModal()}
      </Page>
    )
  }
}

const mapStateToProps = state => ({
  viewport: state.viewport,
  user: state.user,
  account: state.account,
  project: state.project,
  roles: _.get(state, 'references.roles'),
  agreementsDict: _.get(state, 'references.agreements')
})

export default connect(mapStateToProps)(ProjectInfo)
