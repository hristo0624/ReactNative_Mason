import cheerio from 'cheerio'
import _ from 'lodash'
import request from 'co-request'
import model from '../model/model'
import utils from './utils'

const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'Cookie': 'ASP.NET_SessionId=x0ylpbp2h412pge3kawx5zog; __utmc=158387685; __utmz=158387685.1518726332.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utma=158387685.1417232624.1518726332.1518726332.1519006224.2; __utmt=1; __utmt_b=1; __utmb=158387685.36.10.1519006224',
  'Host': 'www2.cslb.ca.gov',
  'Upgrade-Insecure-Requests': '1'
}

async function searchHicName (searchParams, FName = '') {
  try {
    if (searchParams.length > 1) {
      FName = searchParams[1]
    }
    const url = `https://www2.cslb.ca.gov/onlineservices/CheckLicenseII/HisNameSearch.aspx?LName=${searchParams[0]}&FName=${FName}`
    const siteResponse = await request(url, { headers: headers })
    const siteBody = siteResponse && siteResponse.body
    const hisInfo = []

    if (!siteBody) return hisInfo

    const $ = cheerio.load(siteBody)
    const subsRows = $('#ctl00_LeftColumnMiddle_Table1 > tbody').children()
    subsRows.each((i, elt) => {
      const subInfo = {}
      $(elt).children('td').children('table').children('tbody').children().each((j, subParamRaw) => {
        const title = $(subParamRaw).children().first().text()
        const text = $(subParamRaw).children().last().text()
        if (title.match(/Registration #/ig)) {
          subInfo[_.camelCase(title)] = _.trim(text).match(/\d+/g)[0]
        } else {
          subInfo[_.camelCase(title)] = _.trim(text).replace(/\s{2,}/g, ' ')
        }
      })
      model.addHisItem(subInfo, (err) => {
        if (err) {
          console.log('Error:', err)
        }
      })
      hisInfo.push(subInfo)
    })

    return hisInfo
  } catch (e) {
    console.log('can not fetch url', e)
    return []
  }
}

async function searchHicNumber (searchParams, HisLmfPre = 'SP') {
  try {
    const url = `https://www2.cslb.ca.gov/onlineservices/CheckLicenseII/HISDetail.aspx?HISLicNum=${searchParams}&HisLmfPre=${HisLmfPre}`
    const siteResponse = await request(url, { headers: headers })
    const siteBody = siteResponse && siteResponse.body
    const hisInfo = []

    if (!siteBody) return hisInfo

    const $ = cheerio.load(siteBody)
    const hisName = $('#ctl00_LeftColumnMiddle_HISName').text()
    if (hisName) {
      const status = $('#ctl00_LeftColumnMiddle_RegStatus').text()
      let hisStatus = ''

      if (status.match(/expired/ig)) {
        hisStatus = 'Expired'
      } else if (status.match(/canceled/ig)) {
        hisStatus = 'Cancelled'
      } else if (status.match(/active/ig)) {
        hisStatus = 'Active'
      }

      const hisObj = { name: hisName, registration: searchParams, status: hisStatus }
      model.addHisItem(hisObj, (err) => {
        if (err) {
          console.log('Error:', err)
        }
      })
      hisInfo.push(hisObj)
    }
    return hisInfo
  } catch (e) {
    console.log('can not fetch url', e)
    return []
  }
}

export default async function getHicInfo (req, res) {
  try {
    const body = req.body
    const { authToken, searchParams } = body
    const uid = await utils.checkAuth(authToken)
    if (uid) {
      const searchParam = searchParams || ''
      if (searchParam.length && Number(searchParam)) {
        const listNumber = await searchHicNumber(searchParam)
        if (!listNumber.length) {
          model.findHisItems('registration', searchParam, (err, result) => {
            if (err) console.error('error', err)
            res.send(result)
          })
        } else {
          res.send(listNumber)
        }
      } else {
        const listName = await searchHicName(searchParam.split(' '))
        if (!listName.length) {
          model.findHisItems('name', searchParam, (err, result) => {
            if (err) console.error('error', err)
            res.send(result)
          })
        } else {
          res.send(listName)
        }
      }
    } else {
      console.log('inviteMember: authToken validation error')
      return res.status(403).send()
    }
  } catch (e) {
    console.error('getSubcontractors error', e)
    return res.status(501).send()
  }
}
