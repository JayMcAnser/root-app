/**
 * connectiong to the API server
 *
 * version 1.0 Jay 2021-02-03
 * see: https://forum.vuejs.org/t/add-header-token-to-axios-requests-after-login-action-in-vuex/38834/2
 */

import axios from 'axios'
import {debug, error as errorLog, RequestLoginError} from './logging';
// import router  from '../../router';
import { axiosActions } from '../lib/const';
import Vue from 'vue';

let axiosApi = axios.create({
  // withCredentials: true,
  baseURL: process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : 'http://localhost:3050/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})
debug(`api server: ${axiosApi.defaults.baseURL}`, 'lib/axios')

axios.cancelToken = axios.CancelToken;
// axios.isCancel = axios.isCancel;

axiosApi.interceptors.request.use(
  (config) => {
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
      let refreshToken = localStorage.getItem('refresh-token');
      if (refreshToken && LoopCounter401 < 1) {
        LoopCounter401++;
        try {
          let result = await axiosApi.post('auth/refresh', {token: refreshToken});
          if (axiosActions.isOk(result)) {
            let data = axiosActions.data(result)
            debug(`new token: ${data.token}`, LOC)
            localStorage.setItem('authtoken', data.token);
            Vue.$cookies.set('dropperAuth', data.token)
            return axiosApi.request(error.config)
          }
        } catch (e) {

          errorLog(e, LOC);
          throw new RequestLoginError(e.message, 'axios')
          // router.push('login')
        }
      } else {
        LoopCounter401 = 0;
        debug('no refresh token', LOC)
        router.push('/login')
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

