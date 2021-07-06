import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import { View, Image, ActivityIndicator } from 'react-native'
import { withMappedNavigationParams } from 'react-navigation-props-mapper'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'

import screens from 'constants/screens'
import navigationService from 'shared/navigation/service'
import { WHITE, AQUA_MARINE, LIGHT_NAVY, ICE_BLUE } from 'shared/constants/colors'
import TitleWithDesc from 'shared/components/navbar/TitleWithDesc'
import { fontSize, getWidth, getHeight } from 'shared/utils/dynamicSize'
import { StyledText } from 'shared/components/StyledComponents'
import PrimaryButton from 'shared/components/buttons/PrimaryButton'
import SectionList from 'shared/components/sections/SectionList'
import { moneyWithSymbolAbbr } from 'shared/utils/money'
import Textarea from 'shared/components/inputs/Textarea'
import { browseFiles } from 'shared/controllers/files'
import ConfirmationModal from 'shared/components/modals/ConfirmationModal'
import { updateDraft } from 'controllers/workOrder'
import { saveImage, deleteFile } from 'controllers/storage'

const TotalContainer = styled(View)`
  background-color: ${LIGHT_NAVY};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${props => getHeight(60, props.viewport)};
  padding-horizontal: ${props => getWidth(15, props.viewport)};
  width: 100%;
`
const ImagePreview = styled(Image)`
  width: ${props => fontSize(30, props.viewport)};
  height: ${props => fontSize(30, props.viewport)};
`
@withMappedNavigationParams()
class CreateQuote extends Component {
  constructor (props) {
    super(props)
    const workOrder = _.get(props, ['workOrders', props.workOrderId])
    const draft = _.get(props, ['user', 'drafts', props.workOrderId], {})
    const items = _.get(workOrder, 'items', {})
    this.state = {
      workOrder,
      comment: '',
      items,
      files: {},
      deleteFilePromptVisible: false,
      total: this.calcTotal(items),
    }
  }

  static getDerivedStateFromProps (props, state) {
    const newDraft = _.get(props, ['user', 'drafts', props.workOrderId], {})
    const prevDraft = state.prevDraft
    if (newDraft !== prevDraft) {
      return {
        ...state,
        ...newDraft,
        prevDraft: newDraft
      }
    } else {
      return null
    }
  }

  componentWillUnmount = () => {
    this.onFileSelected = () => null
  }

  toggleDeleteFilePrompt = () => this.setState({ deleteFilePromptVisible: !this.state.deleteFilePromptVisible })

  handleFileDelete = () => {
    const { dispatch, workOrderId, user } = this.props
    const storagePathThumb = `workOrders/${workOrderId}/bids/${user.id}/${this.fileId}_thumb`
    dispatch(deleteFile(storagePathThumb))
    const storagePath = `workOrders/${workOrderId}/bids/${user.id}/${this.fileId}`
    dispatch(deleteFile(storagePath))
    dispatch(updateDraft(workOrderId, { [this.fileId]: null }, `files`))
    this.setState({
      deleteFilePromptVisible: false
    })
  }

  renderDeleteFilePromptModal = () => {
    const { deleteFilePromptVisible } = this.state
    return (
      <ConfirmationModal
        title={'Delete the file?'}
        onReject={this.handleFileDelete}
        onApply={this.toggleDeleteFilePrompt}
        onClose={this.toggleDeleteFilePrompt}
        positiveTitle='cancel'
        negativeTitle='delete'
        isVisible={deleteFilePromptVisible}
        showCancel={false}
      />
    )
  }

  renderTitle = () => {
    const { workOrder } = this.state
    const title = _.get(workOrder, 'projectAddress.name', '')
    const desc = _.get(workOrder, 'companyName', '')
    return (
      <TitleWithDesc
        title={title}
        desc={desc}
      />
    )
  }

  onSend = () => {
    const { comment, items, files, workOrder, total } = this.state
    const options = {
      bid: {
        workOrderId: workOrder.id,
        comment,
        items,
        files,
        total
      }
    }
    navigationService.push(screens.VIEW_QUOTE, options)
  }

  calcTotal = (items) => {
    let sum = 0
    for (const itemId in items) {
      const item = items[itemId]
      const cost  = _.get(item, 'cost', 0)
      if (cost > 0) {
        const qty = _.get(item, 'quantity', 1)
        const price = cost * qty
        sum = sum + price
      }
    }
    return sum
  }

  addLineItem = (item) => {
    const { items } = this.state
    const { workOrderId, dispatch } = this.props
    console.log('add line item', item)
    const newItems = {
      ...items,
      [item.id]: item
    }
    dispatch(updateDraft(workOrderId, {
      items: newItems,
      total: this.calcTotal(newItems)
    }))
  }

  delLineItem = (lineItemId) => {
    const { items } = this.state
    const { workOrderId, dispatch } = this.props
    const lineItemsCopy = { ...items }
    delete lineItemsCopy[lineItemId]
    dispatch(updateDraft(workOrderId, {
      items: lineItemsCopy,
      total: this.calcTotal(lineItemsCopy)
    }))
  }


  onLineItemPress = item => () => {
    const options = {
      item,
      addItem: this.addLineItem,
      delItem: this.delLineItem
    }
    navigationService.push(screens.CREATE_LINE_ITEM, options)
  }

  itemsRows = () => {
    const { items } = this.state
    return _.map(items, item => {
      let desc
      const cost = _.get(item, 'cost', 0)
      if (cost > 0) {
        const qty = _.get(item, 'quantity', 1)
        desc = `${qty} x ${moneyWithSymbolAbbr(cost)}`
      }
      return {
        key: item.id,
        title: item.name,
        desc,
        onPress: this.onLineItemPress(item)
      }
    })
  }

  onAddLineItem = () => {
    const options = {
      addItem: this.addLineItem
    }
    navigationService.push(screens.CREATE_LINE_ITEM, options)
  }

  renderTotal = () => {
    const { total } = this.state
    const { viewport } = this.props
    return (
      <TotalContainer viewport={viewport}>
        <StyledText
          color={WHITE}
          fontSize={16}
          bold
        >
          Total
        </StyledText>
        <StyledText
          color={WHITE}
          fontSize={16}
          bold
        >
          {moneyWithSymbolAbbr(total)}
        </StyledText>
      </TotalContainer>
    )
  }

  handleChangeComment = (v) => {
    this.setState({ comment: v })
  }

  saveCommentToDraft = () => {
    const { comment } = this.state
    const { dispatch, workOrderId } = this.props
    dispatch(updateDraft(workOrderId, {
      comment
    }))
  }

  renderFiles = () => {
    const { viewport } = this.props
    const { files } = this.state
    return _.map(files, (file, fileId) => {
      return {
        title: 'Image',
        key: fileId,
        actionField: (
          file.thumbUrl
          ? <ImagePreview
              resizeMode='contain'
              viewport={viewport}
              source={{ uri: file.thumbUrl, cache: 'force-cache' }}
            />
          : <ActivityIndicator size='small' />
        ),
        onPress: this.editFile(fileId)
      }
    })
  }


  onFileSelected = async (f) => {
    const { user, dispatch, workOrderId } = this.props
    console.log('onFileSelected', f)
    this.setState({
      ...this.state.files,
      [f.id]: {
        id: f.id
      }
    })
    const storagePathThumb = `workOrders/${workOrderId}/bids/${user.id}/${f.id}_thumb`
    const thumbUrl = await saveImage(storagePathThumb, f.thumbUrl)
    dispatch(updateDraft(workOrderId, { thumbUrl }, `files/${f.id}`))

    const storagePath = `workOrders/${workOrderId}/bids/${user.id}/${f.id}`
    const url = await saveImage(storagePath, f.url)
    dispatch(updateDraft(workOrderId, { url }, `files/${f.id}`))
  }

  openFilesBrowser = async () => {
    const f = await browseFiles()
    if (!_.isNil(f)) {
      this.onFileSelected(f)
    }
  }

  editFile = (fileId) => () => {
    console.log('edit file', fileId)
    this.fileId = fileId
    this.toggleDeleteFilePrompt()
  }

  renderSubmitButton = () => {
    const { viewport } = this.props
    return (
      <PrimaryButton
        title='Submit quote'
        color={AQUA_MARINE}
        customStyle={`
          width: ${getWidth(260, viewport)};
          align-self: center;
          margin-vertical: ${getHeight(40, viewport)};
        `}
        onPress={this.onSend}
      />
    )
  }

  sections = () => {
    const { comment } = this.state
    const { viewport } = this.props
    return [
      {
        title: 'Items',
        data: [
          ...this.itemsRows(),
          {
            title: 'Add line item',
            key: 'add line item',
            onPress: this.onAddLineItem,
            addNewField: true
          }
        ]
      },
      {
        key: 'total',
        data: [],
        customHeader: this.renderTotal()
      },
      {
        height: getHeight(20, viewport),
        data: [
          {
            key: 'comments',
            customContent: (
              <Textarea
                maxLength={1000}
                placeholder='Comments'
                value={comment}
                onChangeText={this.handleChangeComment}
                onBlur={this.saveCommentToDraft}
              />
            )
          }
        ],
      },
      {
        title: 'Files',
        data: [
          ...this.renderFiles(),
          {
            title: 'Attach files',
            key: 'attach',
            onPress: this.openFilesBrowser,
            addNewField: true
          }
        ]
      },
      {
        key: 'submit',
        data: [],
        noBorder: true,
        customHeader: this.renderSubmitButton()
      },
    ]
  }

  render () {
    return (
      <Page
        statusBarColor={WHITE}
        statusBarStyle='dark-content'
        backgroundColor={ICE_BLUE}
      >
        <NavBar
          leftButton={<BackButton />}
          title={this.renderTitle()}
          rightButton={{ title: 'Send', handler: this.onSend, tintColor: AQUA_MARINE }}
          hideBorder
          backgroundColor={WHITE}
        />
        <SectionList
            keyboardShouldPersistTaps='never'
            sections={this.sections()}
          />
        {this.renderDeleteFilePromptModal()}
      </Page>
    )
  }
}


CreateQuote.propTypes = {
  workOrderId: PropTypes.string
}

const mapStateToProps = state => ({
  workOrders: state.workOrders,
  viewport: state.viewport,
  user: state.user
})

export default connect(mapStateToProps)(CreateQuote)
