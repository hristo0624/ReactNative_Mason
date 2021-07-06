import _ from 'lodash'
import firebase from 'firebase'

import { ref, auth } from 'constants/firebase'
import { receiveProject } from 'model/actions/projectAC'
import { offListener, addListener } from 'controllers/listeners'
import { saveImage } from 'controllers/storage'
import config from 'config'
import headers from 'shared/controllers/headers'

export function fetchProject (projectId) {
  return async function (dispatch, getState) {
    try {
      // console.log('controller: fetchProject', projectId)
      const state = getState()
      const accountId = _.get(state, 'user.currentAccountId')
      const curProjectId = _.get(state, 'project.id')
      if (projectId !== curProjectId) {
        dispatch(receiveProject(null))
        if (curProjectId) {
          offListener('project')
        }

        // fetch project
        const p = `projects/${accountId}/${projectId}`
        const fieldRef = ref.child(p)
        // console.log('project path', p)
        fieldRef.on('value', projectSN => {
          const project = projectSN.val() || {}
          // console.log('project received', project)
          dispatch(receiveProject(project))
        })
        addListener('project', fieldRef)
      }
    } catch (e) {
      console.log('fetchProject error:', e.message)
    }
  }
}

export function updateProjectAdmins (admins) {
  return async function (dispatch, getState) {
    try {
      const state = getState()
      const accountId = _.get(state, 'user.currentAccountId')
      const curProjectId = _.get(state, 'project.id')
      await ref.child(`projects/${accountId}/${curProjectId}/admins`).set(admins)
      await ref.child(`accounts/${accountId}/projectsInfo/${curProjectId}/admins`).set(admins)
    } catch (e) {
      console.log('updateProjectAdmins error:', e.message)
    }
  }
}

export function updateAgreements (agreements) {
  return async function (dispatch, getState) {
    try {
      const state = getState()
      const accountId = _.get(state, 'user.currentAccountId')
      const curProjectId = _.get(state, 'project.id')
      await ref.child(`projects/${accountId}/${curProjectId}/agreements`).set(agreements)
    } catch (e) {
      console.log('updateProjectAdmins error:', e.message)
    }
  }
}

async function inviteSubs (contacts, accountId, projectId, workOrderId) {
  try {
    const currentUser = auth.currentUser
    const authToken = await currentUser.getIdToken()
    const body = {
      authToken,
      contacts,
      accountId,
      projectId,
      workOrderId
    }
    console.log('inviteSubs, body', body)
    const url = `${config.dynamicUrl}/proto/inviteSubs`
    console.log('post to url ', url, 'body', body)
    const response = await fetch(url,
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify(body)
      }
    )
    const answer = await response.json()
    console.log('inviteSubs answer', answer)
  } catch (e) {
    console.log('inviteSubs error:', e.message)
  }
  return null
}

export function saveWorkOrder (wo) {
  return async function (dispatch, getState) {
    try {
      const state = getState()
      const accountId = _.get(state, 'user.currentAccountId')
      const account = _.get(state, 'account')
      const project = _.get(state, 'project')
      const user = _.get(state, 'user')
      if (accountId) {
        const dbwo = {
          id: wo.id,
          projectId: wo.projectId,
          accountId: accountId,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          label: _.get(wo, 'label', null),
          desc: _.get(wo, 'desc', null),
          companyName: _.get(account, 'company.name'),
          projectAddress: _.get(project, 'address'),
          items: _.get(wo, 'items', {}),
          projectManager: _.get(user, 'profile.name')
        }
        await ref.child(`workOrders/${wo.id}`).set(dbwo)

        const contacts = _.get(wo, 'invitedSubs', {})
        inviteSubs(contacts, accountId, wo.projectId, wo.id).then(() => console.log('invites sent'))

        const files = _.get(wo, 'files', {})
        for (const fileId in files) {
          const f = files[fileId]
          const storagePath = `workOrders/${wo.id}/${f.id}`
          const fileUrl = await saveImage(storagePath, f.url)
          const storagePathThumb = `workOrders/${wo.id}/${f.id}_thumb`
          const thumbUrl = await saveImage(storagePathThumb, f.thumbUrl)
          const fileInfo = {
            id: fileId,
            url: fileUrl,
            thumbUrl: thumbUrl
          }
          await ref.child(`workOrders/${wo.id}/files/${f.id}`).set(fileInfo)
        }
      }
    } catch (e) {
      console.log('updateProjectAdmins error:', e.message)
    }
  }
}
