import { error as errorReport} from "../lib/logging";


export const state = () => ({
  message: '',
  status: '', // == 'running'
})

export const mutations = {  
  clear(state) {    
    state.message = '';    
    state.status = ''
  },
  error(state, err) {
    errorReport(err.message, err.where)
    state.message = err.message;
    state.status = 'error'
  }
}

export const actions = {
  async clear({commit}, user) {
    commit('clear')
  },
  async error({commit}, err) {
    commit('error', err)
  }
}
export const getters = {
  hasError: (state) => { return state.status === 'error'},
  isOk: (state) => { return state.status === ''},
  errorMessage: (state) => { return state.message},  
}

export const status = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
