import _ from 'lodash'
import { auth } from 'constants/firebase'
import headers from 'shared/controllers/headers'
import config from 'config'

export async function signOut () {
  try {
    if (auth.currentUser) {
      await auth.signOut()
    }
  } catch (e) {
    console.log('signOut error:', e.message)
  }
}

export function requestSmsCode (phone) {
  return async function (dispatch, getState) {
    try {
      const body = {
        phone
      }
      console.log('requestSmsCode, body', body)
      const url = `${config.dynamicUrl}/proto/requestSmsCode`
      console.log('post to url ', url, 'body', body)
      const response = await fetch(url,
        {
          method: 'post',
          headers: headers,
          body: JSON.stringify(body)
        }
      )
      const answer = await response.json()
      console.log('requestSmsCode answer', answer)
    } catch (e) {
      console.log('requestSmsCode error:', e.message)
    }
  }
}

export async function checkVerificationCode (phone, code) {
  const body = {
    phone,
    code
  }
  console.log('requestSmsCode, body', body)
  const url = `${config.dynamicUrl}/proto/checkVerificationCode`
  console.log('post to url ', url, 'body', body)
  const response = await fetch(url,
    {
      method: 'post',
      headers: headers,
      body: JSON.stringify(body)
    }
  )
  const answer = await response.json()
  console.log('checkVerificationCode answer', answer)
  const authToken = _.get(answer, 'authToken')
  if (authToken) {
    auth.signInWithCustomToken(authToken)
  }
  return answer
}

export async function getSubcontracts (searchParams) {
  try {
    const currentUser = auth.currentUser
    const authToken = await currentUser.getIdToken()
    const url = `${config.dynamicUrl}/proto/getSubcontractors`
    const body = {
      authToken,
      searchParams
    }
    const response = await fetch(url,
      {
        method: 'post',
        headers: headers,
        body: JSON.stringify(body)
      }
    )
    return await response.json()
  } catch (e) {
    console.log('sendInvite e:', e.message)
  }
}
