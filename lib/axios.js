/**
 * connectiong to the API server
 * 
 * version 1.0 Jay 2021-02-03
 * see: https://forum.vuejs.org/t/add-header-token-to-axios-requests-after-login-action-in-vuex/38834/2
 */

import axios from 'axios'
import {debug, error as errorLog} from './logging';

let axiosApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
debug(`api server: ${axiosApi.defaults.baseURL}`, 'lib/axios')

axios.cancelToken = axios.CancelToken;
axios.isCancel = axios.isCancel;

axiosApi.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('authtoken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`
    }
    return config
  },
  (error) => {
    errorLog(error, 'lib/axios.interceptor')
    return Promise.reject(error)
  }
)

export const setHeaders = function(auth = false) {
  if (auth) {    
    axiosApi.defaults.headers.common['Authorization'] = `bearer ${auth}`
  } else {
    delete axios.defaults.headers.common.authentication
  }  
}

export default axiosApi;

