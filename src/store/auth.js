import firebase from 'firebase/app'

export default {
  actions: {

    // Авторизация
    async login ({dispatch, commit}, {email, password}) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
      } catch (e) {
        console.log(dispatch, commit);
        commit('setError', e)
        throw e
      }

    },

    // Выйти из аккаунта
    async logout({commit}) {
      await firebase.auth().signOut()
      commit('clearInfo')
    },

    // получить ID пользователя
    getUid () {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },

    // регистрация
    async register ({dispatch, commit}, {email, password, name}) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        console.log('new user created');
        const uid = await dispatch('getUid');
        await firebase.database().ref(`/users/${uid}/info`).set({
          bill: 126540,
          name: name,
          email: email,
        })
      } catch (e) {
        commit('setError', e)
        throw e
      }

    },
  },
}