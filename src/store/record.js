import firebase from 'firebase/app'

export default {
  actions: {
    async createRecord({dispatch, commit}, record) { // создать запись
      try {
        const uid = await dispatch('getUid');
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async editRecord({dispatch, commit}, newInfo) { // редактирова запись
      try {
        const uid = await dispatch('getUid');
        await firebase.database().ref(`/users/${uid}/records/`).child(newInfo.id).set(newInfo.editedRecord)
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async deleteRecord({dispatch, commit}, recordId) { // удалить запись
      try {
        const uid = await dispatch('getUid');
        await firebase.database().ref(`/users/${uid}/records/${recordId}`).remove()
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async fetchRecord({dispatch, commit}) { // получить записи
      try {
        const uid = await dispatch('getUid');
        const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {}

        return Object.keys(records).map(key => ({...records[key], id: key}))
        
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },    
    async fetchRecordById({dispatch, commit}, id) {  // получить запись по Id
      try {
        const uid = await dispatch('getUid');
        const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}

        return {...record, id: id}
        
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
  }
}