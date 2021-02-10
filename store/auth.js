/**
 * global authentication
 */

import { axiosActions } from '../lib/const';
import { debug, warn, error } from '../lib/logging';
import Axios from '../lib/axios';
import {setHeaders} from '../lib/axios';


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
    state.token = info.token;    
    setHeaders(state.token)    
    if (info.refreshToken) {
      // only when true login, not a /refresh
      localStorage.setItem('refresh-token', info.refreshToken)
    }
  },
  error(state, messaage) {
    localStorage.removeItem('refresh-token')
    error(`auth error: ${messaage}`, 'auth.error')
    state.status = 'error'
  },
  logout(state) {    
    localStorage.removeItem('refresh-token');
    setHeaders(false)
    state.status = '';
    state.username = '';
    state.email = '';
    state.password = '';
    state.token = '',
    state.refreshToken = '';
  }
}

export const actions = {
  async login({commit}, user) {
    commit('request');

    return Axios.post('/auth', {
      username: user.username, 
      password: user.password
    }).then( (result) => {                
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
    commit('logout')
  },

  /**
   * restore the session from the previous stored token
   * 
   * @param {} 
   */
  async restore({commit}) {
    let token =  localStorage.getItem('refresh-token') || '';
    if (token && token.length) {
      return Axios.post('/auth/refresh', {
        token: token
      })
      .then( (result) => {          
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
    }
  }
}
export const getters = {
  isLoggedIn: (state) => { return !!state.token},
  status: (state) => { return state.status},
  user: (state) => { return {username: state.username, email: state.email}},
  token: (state) => { return state.token.length ? state.token : false },
  authHeader: (state) => {
    debug(state, 'auth.authHeader')
    if (state.token && state.token.length) {
      return { 'authorization': `bearer ${state.token}` }      
    }
    return false;
  }

}

export const auth = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
