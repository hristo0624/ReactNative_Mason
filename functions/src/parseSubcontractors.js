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

async function searchBusiness (searchParams) {
  try {
    const url = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/NameSearch.aspx?NextName=${searchParams}&NextLicNum=`
    const siteResponse = await request(url, { headers: headers })
    const siteBody = siteResponse && siteResponse.body
    const subsInfo = []

    if (!siteBody) return subsInfo

    const $ = cheerio.load(siteBody)
    const subsRows = $('#ctl00_LeftColumnMiddle_Table1 > tbody').children()
    subsRows.each((i, elt) => {
      const subInfo = {}
      $(elt).children('td').children('table').children('tbody').children().each((j, subParamRaw) => {
        const title = $(subParamRaw).children().first().text()
        const text = $(subParamRaw).children().last().text()
        if (title === 'Contractor Name') {
          subInfo[_.camelCase('name')] = _.trim(text)
        } else {
          subInfo[_.camelCase(title)] = _.trim(text)
        }
        model.addSubItem(subInfo, (err) => {
          if (err) {
            console.log('Error:', err)
          }
        })
      })
      subsInfo.push(subInfo)
    })

    return subsInfo.filter(item => subsInfoFilter(item, searchParams))
  } catch (e) {
    console.log('can not fetch url', url)
    return []
  }
}

function subsInfoFilter (item, searchParams) {
  const reg = new RegExp(`${searchParams}`, 'gi')
  let nameItem = item.name.match(reg)
  if (nameItem) {
    return nameItem[0] === searchParams || nameItem[0].toLowerCase() === searchParams
  }
  return false
}

async function searchPersonalName (searchParams, NextFName = '') {
  try {
    if (searchParams.length > 1) {
      NextFName = searchParams[1]
    }
    const url = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/PersonnelSearch.aspx?NextLName=${searchParams[0]}&NextFName=${NextFName}`
    const siteResponse = await request(url, { headers: headers })
    const siteBody = siteResponse && siteResponse.body
    const subsInfo = []

    if (!siteBody) return subsInfo

    const $ = cheerio.load(siteBody)
    const subsRows = $('#ctl00_LeftColumnMiddle_Table1 > tbody').children()
    subsRows.each((i, elt) => {
      const $dataContainer = $(elt).children('td').children('table').children('tbody').children().first().children().last().children()
      const name = $dataContainer.text()
      const href = $dataContainer.attr('href')
      subsInfo.push({ name, href })
    })
    return Promise.all(await searchTablePersonalName(subsInfo)).then(res => res)
  } catch (e) {
    console.log('can not fetch url', url)
    return []
  }
}

async function searchTablePersonalName (array) {
  try {
    return array.slice(0, 15).map(async item => {
      const url = `https://www2.cslb.ca.gov/OnlineServices/CheckLicenseII/${item.href}`
      const siteResponse = await request(url, { headers: headers })
      const siteBody = siteResponse && siteResponse.body
      const subInfo = {}

      if (!siteBody) return subInfo

      const $ = cheerio.load(siteBody)
      const subs = $('.add_maincontent_padding > table > tbody').children().last()
      const subsRows = $(subs).children('td').children('table').children('tbody').children()
      subInfo[_.camelCase('name')] = _.trim(item.name)
      subsRows.each((i, elt) => {
        const tittle = $(elt).children('td').first().text()
        const value = $(elt).children('td').last().text()
        if (tittle === 'Business Name') {
          subInfo[_.camelCase('business')] = _.trim(value)
        } else {
          subInfo[_.camelCase(tittle)] = _.trim(value)
        }
      })
      model.addSubBusiness(subInfo, (err) => {
        if (err) {
          console.log('Error:', err)
        }
      })
      return subInfo
    })
  } catch (e) {
    console.log('can not fetch url', url)
    return []
  }
}

export default async function getSubcontractors (req, res) {
  try {
    const body = req.body
    const { authToken, searchParams } = body
    const uid = await utils.checkAuth(authToken)
    if (uid) {
      const searchParam = searchParams || ''
      if (searchParam.length > 3 && Number(searchParam)) {
        model.findSubItems('license', searchParam, (err, result) => {
          if (err) console.error('error', err)
          res.send(result)
        })
      } else {
        const list = await searchBusiness(searchParam)
        if (list.length < 10) {
          const nameList = await searchPersonalName(searchParam.split(' '))
          if (!nameList.length) {
            model.findSubItems('business', searchParam, (err, result) => {
              if (err) console.error('error', err)
              res.send(result)
            })
          } else {
            res.send(nameList)
          }
        } else {
          res.send(list)
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
