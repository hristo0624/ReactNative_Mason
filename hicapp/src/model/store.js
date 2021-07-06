import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from 'model/reducers/rootReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const configureStore = (initialState) => {
  let enhancer = composeEnhancers(applyMiddleware(thunk))
  return createStore(rootReducer, initialState, enhancer)
}

const store = configureStore()
export default store
