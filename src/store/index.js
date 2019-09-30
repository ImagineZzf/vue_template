import Vue from 'vue'
import Vuex from 'vuex'

import list from './list'

Vue.use(Vuex)

const state = {}

const getters = {}

const mutations = {}

const actions = {}

export default new Vuex.Store({
  modules: {
    list
  },
  state,
  getters,
  mutations,
  actions
})
