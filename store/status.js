import { debug, error, error as errorReport, warn} from "../lib/logging";
import { apiState } from '../lib/const';

export const state = () => ({
  message: '',
  status: apiState.idle,
  leftDrawer: false,
  rightDrawer: false,
  actions: {},
  dialog: {
    name: '',
    id: 0,
  }
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
  },
  toggleRightDrawer(state) {
    state.rightDrawer = !state.rightDrawer
  },
  dialog(state, show) {
    state.dialog = {
      name: show.name ? show.name : show.dialog,
      id: show.id === '' || !show.id || show.id === '0' || undefined ? false : show.id
    }
    debug(`dialog: ${state.dialog.name} on id: ${state.dialog.id}`, 'status.dialog')
  },
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
  async toggleRightDrawer({commit}) {
    debug(`toggle right drawer`, 'status');
    commit('toggleRightDrawer');
  },
  async apiStatus({commit}, status) {
    commit('apiState', status)
  },
  dialog({commit}, status = false) {
    if (typeof status === 'string') {
      commit('dialog', {name: status, id: 0})
    } else if (typeof status === 'object') {
      commit('dialog', status)
    } else if (typeof status === 'boolean' || status === undefined) {
      commit('dialog', {name: '', id: 0})
    } else {
      warn(`unknonw dialog type ${JSON.stringify(status)}`)
    }
  }
}
export const getters = {
  hasError: (state) => { return state.status === 'error'},
  isOk: (state) => { return state.status === ''},
  errorMessage: (state) => { return state.message},
  leftDrawer: (state) => { return state.leftDrawer},
  rightDrawer: (state) => { return state.rightDrawer},
  dialogName: (state) => state.dialog.name,
  dialogId: (state) => state.dialog.id,
}

export const status = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
