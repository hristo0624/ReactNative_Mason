import config from 'config'
import { sendRequest } from 'controllers/auth'

export const getSubcontracts = (searchParams) => {
  const url = `${config.dynamicUrl}/proto/getSubcontractors`
  return sendRequest(url, searchParams.toLowerCase())
}

export const getHic = (searchParams) => {
  const url = `${config.dynamicUrl}/proto/getHicInfo`
  return sendRequest(url, searchParams.toLowerCase())
}
