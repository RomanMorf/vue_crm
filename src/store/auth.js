import firebase from 'firebase/app'

export default {
  actions: {

    async login ({commit}, {email, password}) { // Авторизация
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
      } catch (e) {
        commit('setError', e)
        throw e
      }

    },

    async logout({commit}) {  // Выйти из аккаунта
      await firebase.auth().signOut()
      commit('clearInfo')
    },

    getUid () { // получить ID пользователя
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    },

    getUserData() { // получить данные из формы аутентификации
      const userData = firebase.auth().currentUser
      return userData ? userData : null
    },

    async register ({dispatch, commit}, {email, password, name}) { // регистрация
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        await firebase.auth().sendPasswordResetEmail
        await firebase.auth().verifyPasswordResetCode
        await firebase.auth().confirmPasswordReset

        const uid = await dispatch('getUid');
        await firebase.database().ref(`/users/${uid}/userInfo`).set({
          bill: 100000,
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