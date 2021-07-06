import connection from './connect'

const model = {
  getSubList: (callback) => {
    return connection.query('SELECT * FROM subcontractorsList;', callback)
  },

  addSubItem: (item, callback) => {
    const insertData = { name: '', license: item.license, business: item.name, status: item.status }
    const updateData = { license: item.license, business: item.name, status: item.status }
    if (insertData.license && updateData.license) {
      return connection.query('INSERT INTO subcontractorsList SET ? ON DUPLICATE KEY UPDATE ?', [insertData, updateData], callback)
    }
  },

  addSubBusiness: (item, callback) => {
    const insertData = { name: item.name, business: '', license: item.license, status: item.status }
    const updateData = { name: item.name, license: item.license, status: item.status }
    if (insertData.license && updateData.license) {
      return connection.query('INSERT INTO subcontractorsList SET ? ON DUPLICATE KEY UPDATE ?', [insertData, updateData], callback)
    }
  },

  addHisItem: (item, callback) => {
    const data = { name: item.name, registration: item.registration, status: item.status }
    if (data.registration) {
      return connection.query('INSERT INTO HisList SET ? ON DUPLICATE KEY UPDATE ?', [data, data], callback)
    }
  },

  findSubItems: (select, searchParams, callback) => {
    return connection.query('SELECT * FROM subcontractorsList WHERE ?? LIKE ? LIMIT 15;', [select, `${searchParams}%`], callback)
  },

  findHisItems: (select, searchParams, callback) => {
    return connection.query('SELECT * FROM HisList WHERE ?? LIKE ? LIMIT 15;', [select, `${searchParams}%`], callback)
  }
}

export default model
