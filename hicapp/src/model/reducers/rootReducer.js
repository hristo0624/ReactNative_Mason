import { combineReducers } from 'redux'
import references from 'model/reducers/references'
import user from 'model/reducers/user'
import account from 'model/reducers/account'
import viewport from 'model/reducers/viewport'
import project from 'model/reducers/project'
import workOrders from 'model/reducers/workOrders'
import messages from 'model/reducers/messages'
import typing from 'model/reducers/typing'
import readBy from 'model/reducers/readBy'
import unread from 'model/reducers/unread'

export default combineReducers({
  project,
  references,
  user,
  account,
  viewport,
  workOrders,
  messages,
  typing,
  readBy,
  unread
})
