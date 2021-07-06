import { combineReducers } from 'redux'

import viewport from 'model/reducers/viewport'
import references from 'model/reducers/references'
import user from 'model/reducers/user'
import messages from 'model/reducers/messages'
import typing from 'model/reducers/typing'
import profiles from 'model/reducers/profiles'
import workOrders from 'model/reducers/workOrders'
import readBy from 'model/reducers/readBy'
import unread from 'model/reducers/unread'

export default combineReducers({
  viewport,
  references,
  user,
  messages,
  typing,
  profiles,
  workOrders,
  unread,
  readBy
})
