/**
 * global authentication
 */

import { axiosActions } from '../lib/const';
import { debug, warn, error } from '../lib/logging';
import Axios from '../lib/axios';


export const state = () => ({
  status: '',
  username: '',
  email: '',
  password: '',
  token: '',
  resfreshToken: ''
})

export const mutations = {  
  request(state) {
    state.token = ''
    state.status = 'loading'
  },
  success(state, info) {
    state.status = 'sucess';
    state.username = info.user.name;
    state.email = info.user.email;
    state.token = info.token
  },
  error(state, messaage) {
    error(`auth error: ${messaage}`, 'auth.error')
    state.status = 'error'
  },
  logout(state) {
    state.status = '';
    state.token = ''
  }
}

export const actions = {
  async login({commit}, user) {
    commit('request');

    return Axios.post('/auth', {
      username: user.username, 
      password: user.password
    }).then( (result) => {          
      // if (result.data.errors) {        
      if (axiosActions.hasErrors(result)) {
        commit('logout')
        throw new Error(axiosActions.errorMessage(result))
      } else {        
        commit('success', axiosActions.data(result));
        return true;
      }
    })
    .catch( (err) => {
      commit('logout')
      throw new Error(err.message)
    })
  },

  logout({commit}) {

  }
}
export const getters = {
  isLoggedIn: (state) => { return !!state.token},
  status: (state) => { return state.status},
}

export const auth = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
