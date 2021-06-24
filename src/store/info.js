import firebase from 'firebase/app'

export default {
  state: {
    info: {},
  },

  mutations: {
    setInfo(state, info) {
      state.info = info
    },
    clearInfo (state) {
      state.info = {}
    }
  },

  actions: {
    async updateInfo({dispatch, commit, getters}, toUpdate) { // обновить инфо
      try {
        const uid = await dispatch('getUid')
        const updateData = {...getters.info, ...toUpdate}
        if (uid) {
          await firebase.database().ref(`/users/${uid}/userInfo`).set(updateData)
        }
        commit('setInfo', updateData)

      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async fetchInfo ({dispatch, commit}) { //получить инфо
      try {
        const uid = await dispatch('getUid');
        const info = (await firebase.database().ref(`/users/${uid}/userInfo`).once('value')).val();
        commit('setInfo', info);

      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
  },

  getters: {
    info: s => s.info
  }
}