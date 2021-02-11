import { error as errorReport} from "../lib/logging";
import { apiState } from '../lib/const';

export const state = () => ({
  message: '',
  status: apiState.idle,
  leftDrawer: false,
  rightDrawer: false,
})

export const mutations = {  
  clear(state) {    
    state.message = '';    
    state.status = apiState.idle
  },
  error(state, err) {
    errorReport(err.message, err.where)
    state.message = err.message;
    state.status = apiState.error
  },
  apiState(state, a) {
    state.status = a;
  },
  
  leftDrawer(state, show) {
    state.leftDrawer = !! show
  },
  rightDrawer(state, show) {
    state.rightDrawer = !! show
  }
}

export const actions = {
  async clear({commit}, user) {
    commit('clear')
  },
  async error({commit}, err) {
    commit('error', err)
  },
  async leftDrawer({commit}, show) {
    commit('leftDrawer', show)
  },
  async rightDrawer({commit}, show) {
    commit('rightDrawer', show)
  },
  async apiStatus({commit}, status) {
    commit('apiState', status)
  }
}
export const getters = {
  hasError: (state) => { return state.status === 'error'},
  isOk: (state) => { return state.status === ''},
  errorMessage: (state) => { return state.message},  
  leftDrawer: (state) => { return state.leftDrawer},
  rightDrawer: (state) => { return state.rightDrawer},
}

export const status = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
