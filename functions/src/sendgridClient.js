import sgMail from '@sendgrid/mail'
import * as functions from 'firebase-functions'
const config = functions.config()

sgMail.setApiKey(config.sendgrid.api_key)

async function sendEmail (to, templateId, templateData, attachments) {
  try {
    const msg = {
      to,
      from: {
        email: config.sendgrid.email,
        name: config.sendgrid.name
      },
      templateId
    }
    if (templateData) msg.dynamic_template_data = templateData
    if (attachments) msg.attachments = attachments
    await sgMail.send(msg)
    return true
  } catch (e) {
    console.error('email was not sent', e.message)
    return false
  }
}

async function getTemplate (templateId) {
  const sgClient = require('@sendgrid/client')
  sgClient.setApiKey(config.sendgrid.api_key)
  const request = {
    method: 'GET',
    url: `/v3/templates/${templateId}`
  }
  try {
    const result = await sgClient.request(request)
    const [response, body] = result
    const { versions } = body
    const activeVersion = versions.find(v => v.active === 1)
    return activeVersion
  } catch (e) {
    console.log(e.message)
    return null
  }
}

export default {
  sgMail,
  sendEmail,
  getTemplate
}
