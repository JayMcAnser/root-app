/**
 * connectiong to the API server
 *
 * version 1.0 Jay 2021-02-03
 * see: https://forum.vuejs.org/t/add-header-token-to-axios-requests-after-login-action-in-vuex/38834/2
 */

import axios from 'axios'
import {debug, error as errorLog, RequestLoginError} from './logging';

// SHOULD WORK BUT ... import { router } from '../../routes';
import { axiosActions } from '../lib/const';
// SHOULD WORK: import Vue from 'vue';

// Vite: https://vitejs.dev/guide/env-and-mode.html
let env = import.meta.env;
let axiosApi = axios.create({
  // withCredentials: true,
  baseURL: env && env.VITE_API_URL ? env.VITE_API_URL : 'http://localhost:3050/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})
debug(`api server: ${axiosApi.defaults.baseURL}`, 'lib/axios')

axiosApi.cancelToken = axios.CancelToken;
// axios.isCancel = axios.isCancel;

axiosApi.interceptors.request.use(
  (config) => {
    if (typeof localStorage === 'undefined') {
      return config;
    }
    let token = localStorage.getItem('authtoken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`
    }
    return config
  },function (error) {
    errorLog(error, 'lib/axios.interceptor.request')
    return Promise.reject(error)
  }
)
let LoopCounter401 = 0;

axiosApi.interceptors.response.use(null,

  async function (error) {
    const LOC = 'axios.interceptor.response';
    if (error.response && error.response.status === 401 ) {
      debug('refresh token', LOC)
      if (typeof localStorage !== 'undefined') {
        let refreshToken = localStorage.getItem('refresh-token');
        if (refreshToken && LoopCounter401 < 1) {
          LoopCounter401++;
          try {
            let result = await axiosApi.post('auth/refresh', {token: refreshToken});
            if (axiosActions.isOk(result)) {
              let data = axiosActions.data(result)
              debug(`new token: ${data.token}`, LOC)
              localStorage.setItem('authtoken', data.token);
              // Vue.$cookies.set('dropperAuth', data.token)
              return axiosApi.request(error.config)
            }
          } catch (e) {
            errorLog(e, LOC);
            throw new RequestLoginError(e.message, 'axios')
          }
        }
      } else {
        LoopCounter401 = 0;
        debug('no refresh token', LOC)
        // SHOULD WORK BUT ...  await router.push({ name: 'login'})
      }
    } else {
      errorLog(error, LOC);
    }
    return Promise.reject(error)
  }
)

export const setHeaders = function(auth = false) {
  debug(auth, 'axios.setHeader')
  if (auth) {
    axiosApi.defaults.headers.common['Authorization'] = `bearer ${auth}`;
    axios.defaults.headers.common['Authorization'] = `bearer ${auth}`;
  } else {
    delete axiosApi.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.Authorization;
  }
}

export default axiosApi;

