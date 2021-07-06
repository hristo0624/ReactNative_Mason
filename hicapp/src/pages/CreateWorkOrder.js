import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Image, View } from 'react-native'
import _ from 'lodash'
import generate from 'firebase-auto-ids'
import styled from 'styled-components'

import Page from 'shared/components/Page'
import NavBar from 'shared/components/NavBar'
import BackButton from 'shared/components/navbar/BackButton'
import SectionList from 'shared/components/sections/SectionList'
import { PALE_GREY, WHITE, AQUA_MARINE } from 'shared/constants/colors'
import ModalSelect from 'shared/components/modals/ModalSelect'
import { fetchProject, saveWorkOrder } from 'controllers/project'
import navigationService from 'shared/navigation/service'
import screens from 'constants/screens'
import SectionItemInput from 'shared/components/sections/SectionItemInput'
import SectionTextarea from 'shared/components/sections/SectionTextarea'
import ConfirmationModal from 'shared/components/modals/ConfirmationModal'
import Checkbox from 'shared/components/Checkbox'
import { fontSize } from 'shared/utils/dynamicSize'
import { browseFiles } from 'shared/controllers/files'

const ImagePreview = styled(Image)`
  width: ${props => fontSize(30, props.viewport)};
  height: ${props => fontSize(30, props.viewport)};
`

class CreateWorkOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: generate(_.now()),
      projectSelectorVisible: false,
      lineItems: {},
      selectedLineItems: {},
      label: '',
      desc: '',
      errors: {},
      files: {},
      deleteFilePromptVisible: false,
      invitedSubs: {}
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (!_.isNil(props.project) && props.project !== state.prevProject) {
      const projectLineItems = _.get(props, 'project.lineItems', {})
      const lineItems = {}
      for (const itemId in projectLineItems) {
        const item = projectLineItems[itemId]
        lineItems[itemId] = {
          id: itemId,
          name: _.get(item, 'name', ''),
          desc: _.get(item, 'desc', '')
        }
      }
      return {
        prevProject: props.project,
        lineItems
      }
    } else {
      return null
    }
  }

  loadProject = (projectId) => {
    const { dispatch } = this.props
    dispatch(fetchProject(projectId))
  }

  toggleProjectSelector = () => this.setState({ projectSelectorVisible: !this.state.projectSelectorVisible })

  toggleLineItem = (itemId) => () => {
    const { selectedLineItems } = this.state
    this.setState({
      selectedLineItems: {
        ...selectedLineItems,
        [itemId]: !_.get(selectedLineItems, itemId, false)
      }
    })
  }

  renderProjectSelect = () => {
    const { account, project } = this.props
    const { projectSelectorVisible } = this.state
    const projectsInfo = _.get(account, 'projectsInfo', {})
    const items = _.map(projectsInfo, pr => ({
      title: _.get(pr, 'address.description', '').substr(0, 35),
      id: _.get(pr, 'id')
    }))
    return (
      <ModalSelect
        visible={projectSelectorVisible}
        onClose={this.toggleProjectSelector}
        onSelect={this.loadProject}
        selectedId={_.get(project, 'id')}
        items={items}
      />
    )
  }

  onCreateNewLineItem = () => {
    const options = {
      addItem: this.addItem
    }
    navigationService.push(screens.WORK_ORDER_LINE_ITEM, options)
  }

  addItem = (item) => {
    const { lineItems, selectedLineItems } = this.state
    this.setState({
      lineItems: {
        ...lineItems,
        [item.id]: item
      },
      selectedLineItems: {
        ...selectedLineItems,
        [item.id]: true
      }
    })
  }

  delItem = (itemId) => {
    const { lineItems } = this.state
    const lineItemsCopy = { ...lineItems }
    delete lineItemsCopy[itemId]
    this.setState({
      lineItems: lineItemsCopy
    })
  }

  editLineItem = item => () => {
    const options = {
      item,
      addItem: this.addItem,
      delItem: this.delItem
    }
    navigationService.push(screens.WORK_ORDER_LINE_ITEM, options)
  }

  renderLineItems = () => {
    const { viewport } = this.props
    const { lineItems, selectedLineItems } = this.state
    return _.map(lineItems, (item, itemId) => {
      return {
        title: item.name,
        key: itemId,
        desc: item.desc,
        actionField: (
          <Checkbox
            size={fontSize(26, viewport)}
            checked={_.get(selectedLineItems, itemId, false)}
            color={AQUA_MARINE}
            onClick={this.toggleLineItem(itemId)}
          />
        ),
        onPress: this.toggleLineItem(itemId)
        // onPress: this.editLineItem(item)
      }
    })
  }

  handleChange = fieldName => value => {
    this.setState({
      [fieldName]: value
    })
  }

  resetError = (name) => () => {
    const { errors } = this.state
    const errorsCopy = { ...errors }
    delete errorsCopy[name]
    this.setState({ errors: errorsCopy })
  }

  onBrowseFiles = async () => {
    const f = await browseFiles()
    if (!_.isNil(f)) {
      this.setState({
        files: {
          ...this.state.files,
          [f.id]: f
        }
      })
    }
  }

  toggleDeleteFilePrompt = () => this.setState({ deleteFilePromptVisible: !this.state.deleteFilePromptVisible })

  handleFileDelete = () => {
    const { files } = this.state
    const filesCopy = { ...files }
    delete filesCopy[this.fileId]
    this.setState({
      files: filesCopy,
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

  editFile = (fileId) => () => {
    console.log('edit file', fileId)
    this.fileId = fileId
    this.toggleDeleteFilePrompt()
  }

  renderFiles = () => {
    const { viewport } = this.props
    const { files } = this.state
    return _.map(files, (file, fileId) => {
      return {
        title: 'Image',
        key: fileId,
        actionField: <ImagePreview resizeMode='contain' viewport={viewport} source={{ uri: file.thumbUrl }} />,
        onPress: this.editFile(fileId)
      }
    })
  }

  updateInvitedSubs = (subs) => {
    this.setState({ invitedSubs: subs })
  }

  inviteSubs = () => {
    const { invitedSubs } = this.state
    const options = {
      invitedSubs,
      onSelect: this.updateInvitedSubs
    }
    navigationService.push(screens.INVITED_SUBS, options)
  }

  renderInvitedSubs = () => {
    const { invitedSubs } = this.state
    return _.map(invitedSubs, c => ({
      title: `${_.get(c, 'firstName', '')} ${_.get(c, 'lastName', '')}`,
      key: c.id,
      desc: _.get(c, 'spec', _.get(c, 'company', _.get(c, 'phone'))),
      notClickable: true,
      actionField: <View />
    }))
  }

  sections = () => {
    const { project } = this.props
    const { errors, label, desc } = this.state
    const address = _.get(project, 'address.description')
    const ownerName = `${_.get(project, 'owner.firstName', '')} ${_.get(project, 'owner.lastName', '')}`
    return [
      {
        title: 'Project',
        data: [
          {
            title: ownerName,
            desc: address,
            key: 0,
            onPress: this.toggleProjectSelector
          }
        ]
      },
      {
        title: 'Scope of work',
        data: [
          ...this.renderLineItems(),
          {
            title: 'Create new line item',
            key: 'newLineItem',
            onPress: this.onCreateNewLineItem,
            addNewField: true
          }
        ]
      },
      {
        title: 'Work order',
        data: [
          {
            title: 'Label',
            key: 'label',
            error: _.get(errors, 'label'),
            actionField: (
              <SectionItemInput
                value={label}
                onChange={this.handleChange('label')}
                onFocus={this.resetError('label')}
              />
            )
          },
          {
            key: 'desc',
            customContent: (
              <SectionTextarea
                placeholder='Description of work order'
                value={desc}
                onChangeText={this.handleChange('desc')}
              />
            )
          }
        ]
      },
      {
        title: 'Files',
        data: [
          ...this.renderFiles(),
          {
            title: 'Attach files',
            key: 'attach',
            onPress: this.onBrowseFiles,
            addNewField: true
          }
        ]
      },
      {
        title: 'Invite',
        data: [
          ...this.renderInvitedSubs(),
          {
            title: 'Invite one or more subcontractors',
            key: 'invite',
            onPress: this.inviteSubs,
            addNewField: true
          }
        ]
      }
    ]
  }

  save = () => {
    const { project, dispatch } = this.props
    const { id, lineItems, selectedLineItems, label, desc, files, invitedSubs } = this.state
    const items = {}
    for (const itemId in selectedLineItems) {
      _.set(items, itemId, _.get(lineItems, itemId))
    }
    const wo = {
      id,
      projectId: project.id,
      items,
      label,
      desc,
      files,
      invitedSubs
    }
    dispatch(saveWorkOrder(wo))
    console.log('SAVE wo:', wo)
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
          title={{ title: 'New work order' }}
          leftButton={<BackButton />}
          rightButton={{
            tintColor: AQUA_MARINE,
            title: 'Send',
            handler: this.save
          }}
        />
        <SectionList
          stickySectionHeadersEnabled={false}
          sections={this.sections()}
        />
        {this.renderProjectSelect()}
        {this.renderDeleteFilePromptModal()}
      </Page>
    )
  }
}

const mapStateToProps = (state) => ({
  viewport: state.viewport,
  project: state.project,
  account: state.account
})

export default connect(mapStateToProps)(CreateWorkOrder)
