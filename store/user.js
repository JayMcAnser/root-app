import { debug, error, error as errorReport, warn} from "../lib/logging";
import { apiState } from '../lib/const';

export const state = () => ({
  isAuthenticated: false,
  email: '',
  username: ''
})

export const mutations = {
  login(state, user) {
    state.isAuthenticated = true
    state.email = user.email;
    state.name = user.name
    console.log('THIS', state)
  },
  logout(state) {
    state.isAuthenticated = false;
  }

}

export const actions = {
  async init({commit, dispatch}, user) {
    // setup the listeners for that login / logout
    await dispatch('auth/registerEvent', {name: 'userLogin', call: 'user/login', action: 'login' }, {root: true})
    await dispatch('auth/registerEvent', {name: 'userLogout', call: 'user/logout', action: 'logout' }, { root: true})
    // commit('login', user)
  },

  async login({commit}, user) {
    console.log('WHAT', user)
    debug('user login', 'store.user.login')
    commit('login', user)
  },
  async logout({commit}) {
    debug('user logout', 'store.user.logout')
    commit('logout')
  }
}
export const getters = {
  isAuthenticated: (state) => { return state.isAuthenticated },
  name: (state) => { return state.isAuthenticated ? state.name : 'no name'},
  email: (state) => { return state.isAuthenticated ? state.email : undefined },
}

export const user = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
