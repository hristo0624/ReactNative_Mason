import { combineReducers } from 'redux'
import references from 'model/reducers/references'
import user from 'model/reducers/user'
import account from 'model/reducers/account'
import lineItems from 'model/reducers/lineItems'

export default combineReducers({
  references,
  user,
  account,
  lineItems
})
