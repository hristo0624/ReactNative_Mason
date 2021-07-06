import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import _ from 'lodash'
import { SMS, MailComposer, Print } from 'expo'
import { Share, Alert } from 'react-native'
import moment from 'moment'

import { StyledText } from 'components/StyledComponents'
import Modal from 'components/modals/Modal'
import DefaultButton from 'components/buttons/DefaultButton'
import { getHeight, fontSize } from 'utils/DynamicSize'
import { DUSK, DEEP_SKY_BLUE } from 'constants/colors'
import { DOCUMENT_PAGE_URL, isIos, isAndroid } from 'constants/index'
import docStatus from 'constants/docStatus'
import { localizeText } from 'model/selectors/localize'
import { emailDocTemplate, getDocumentHtml, setDocumentStatus, fetchDocument } from 'controllers/documents'
import { getEmails } from 'utils/clientHelper'
import googleAnalytics from 'utils/googleAnalytics'

const Header = styled.View`
  align-items: center;
`
const Buttons = styled.View`
  width: 100%;
  margin-top: ${props => getHeight(14, props.viewport)};
`
const Button = styled(DefaultButton)`
  margin-vertical: ${props => getHeight(6, props.viewport)};
`

class SendModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      processing: false,
      client: props.client
    }
  }

  static getDerivedStateFromProps (props, state) {
    if (props.docId && !props.client && !state.client) {
      const { docId, documents, dispatch } = props
      if (!_.has(documents, docId)) {
        dispatch(fetchDocument(docId))
      } else {
        const doc = _.get(documents, docId)
        return {
          client: _.get(doc, 'client', null)
        }
      }
    }
    return null
  }

  getDocPdf = async () => {
    try {
      const { docId, currentAccount } = this.props
      const html = await getDocumentHtml(docId, currentAccount)
      if (html) {
        let result
        if (isIos) {
          result = await Print.printToFileAsync({ html, width: 595, height: 842 }) // default is US Letter, a4 is 595x842
        } else {
          result = await Print.printToFileAsync({ html })
        }
        return result.uri
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  getBody = (html, url) => {
    if (isIos) {
      return html
    } else {
      const bodyTags = html.match(/<\/*body[^>]*>/gim)
      const bodyContent = html.slice(html.indexOf(bodyTags[0]), -(bodyTags[1].length))
      const preheaderTags = bodyContent.match(/<\/*div[^>]*>/gim)
      const content = bodyContent.slice(bodyContent.indexOf(preheaderTags[0]), -(preheaderTags[1].length))
      console.log('bodyContent', content)
      return content
    }
  }

  onSendEmail = async () => {
    const { docId, currentAccount, onClose, dispatch } = this.props
    const { client } = this.state
    const recipients = getEmails(client)
    this.setState({ processingEmail: true })
    const pdf = await this.getDocPdf()
    const { html, subject, plainText } = await emailDocTemplate(docId, currentAccount)
    this.setState({ processingEmail: false })
    const options = {
      recipients,
      subject,
      body: isIos ? html : plainText,
      isHtml: isIos,
      attachments: pdf ? [pdf] : null
    }
    googleAnalytics.sendDocument('email')
    MailComposer.composeAsync(options)
      .then(result => {
        if (_.get(result, 'status') === 'sent') {
          dispatch(setDocumentStatus(docId, docStatus.SENT))
        }
      })
      .catch(this.showError)
    onClose()
  }

  composeMessage = (type, docId, accountId, document) => {
    const { localize } = this.props
    const docType = _.toLower(localize(_.snakeCase(type)))
    if (document && document.overdue) {
      return localize('document_text_message_overdue', {
        docType,
        date: moment(document.createdAt).format('MMM DD, gggg'),
        url: `${DOCUMENT_PAGE_URL}/document?accId=${accountId}&docId=${docId}`
      })
    }
    return localize('document_text_message', {
      docType,
      url: `${DOCUMENT_PAGE_URL}/document?accId=${accountId}&docId=${docId}`
    })
  }

  onSendSms = async () => {
    const { onClose } = this.props
    try {
      const isAvailable = await SMS.isAvailableAsync()
      const { docId, docType, currentAccount, document, dispatch } = this.props
      const { client } = this.state
      if (isAvailable) {
        this.setState({ processingSms: true })
        const addresses = _.get(client, 'mobile', '')
        const message = this.composeMessage(docType, docId, currentAccount, document)
        const { result: actionResult } = await SMS.sendSMSAsync(addresses, message)
        this.setState({ processingSms: false })
        googleAnalytics.sendDocument('sms')
        if (actionResult === 'cancelled') {
          return null
        }
        if (isAndroid || (actionResult === 'sent')) {
          dispatch(setDocumentStatus(docId, docStatus.SENT))
        }
        return onClose()
      } else {
        this.showError(new Error('SMS is not available'))
      }
    } catch (e) {
      this.setState({ processingSms: false })
      this.showError(e)
    }
  }

  onMore = () => {
    const { docId, docType, currentAccount, document, localize, dispatch, onClose } = this.props
    googleAnalytics.sendDocument('share')
    return Share.share({
      message: this.composeMessage(docType, docId, currentAccount, document),
      title: localize('share_document', { docType })
    })
      .then(({ action }) => {
        if (action === Share.sharedAction) {
          dispatch(setDocumentStatus(docId, docStatus.SENT))
          return onClose()
        } else {
          return null
        }
      })
      .catch(this.showError)
  }

  showError = (e) => {
    Alert.alert('', e.message, [
      {
        text: 'Ok',
        onPress: () => null
      }
    ])
  }

  render () {
    const { isVisible, onClose, document, localize, viewport } = this.props
    const { processingEmail, processingSms } = this.state
    if (!document) {
      return null
    }
    const { clientName, docNum, docType } = document
    return (
      <Modal isVisible={isVisible} onClose={onClose} withMargin>
        <Header viewport={viewport}>
          <StyledText color={DUSK} fontSize={16}>
            {localize('send_document_to', { docType: localize(_.snakeCase(docType)), docNum })}
          </StyledText>
          <StyledText color={DEEP_SKY_BLUE} fontSize={20} customStyle={`line-height: ${fontSize(38, viewport)};`}>
            {clientName}
          </StyledText>
        </Header>
        <Buttons viewport={viewport}>
          <Button
            viewport={viewport}
            title={localize('email')}
            icon='send'
            onPress={this.onSendEmail}
            loading={processingEmail}
          />
          <Button
            viewport={viewport}
            title={localize('sms')}
            icon='sms'
            onPress={this.onSendSms}
            loading={processingSms}
          />
          <Button
            viewport={viewport}
            title={localize('more')}
            icon='more'
            onPress={this.onMore}
          />
        </Buttons>
      </Modal>
    )
  }
}

SendModal.defaultProps = {
}

SendModal.propTypes = {
  docType: PropTypes.string,
  docId: PropTypes.string,
  client: PropTypes.object,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func
}

const mapStateToProps = (state, props) => ({
  currentAccount: state.user.currentAccount,
  viewport: state.viewport,
  localize: localizeText(state),
  document: _.get(state.documentsInfo, props.docId),
  documents: state.documents
})

export default connect(mapStateToProps)(SendModal)
