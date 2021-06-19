import firebase from 'firebase/app'

export default {
  actions: {
    async createCategory({commit, dispatch}, {title, limit}) { // создать категорию
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({title, limit})
        return {title, limit, id: category.key}

        // await firebase.database().ref(`/users/${uid}/categories/${title}/`).set({
        //   title, 
        //   limit
        // })
        // return {title, limit}
      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
    async editCategory({commit, dispatch}, {title, limit, id}) { // редактровать категорию
      try {
        const uid = await dispatch('getUid')
        // await firebase.database().ref(`/users/${uid}/categories/${id}/`).set({title, limit})
        await firebase.database().ref(`/users/${uid}/categories/`).child(id).update({title, limit})
      } catch (error) {
      
        commit('setError', error)
        throw error
      }
    },
    async fetchCategories({commit, dispatch}) { // получить список категорий
      try {
        const uid = await dispatch('getUid')
        const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val()

        // const cats = []
        // Object.keys(categories).forEach(key => {
        //   cats.push({
        //     title: categories[key].title,
        //     limit: categories[key].limit,
        //     id: key
        //   })
        // })
        // return cats
        if (categories) {
          return Object.keys(categories).map(key => ({...categories[key], id: key})) // аналогично закомментированному коду выше
        } 

        return

      } catch (error) {
        console.log(error, 'error');
        commit('setError', error)
        throw error
      }
    },    
    async fetchCategoryById({commit, dispatch}, id) { // получить список категориц по Id
      try {
        const uid = await dispatch('getUid')
        const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val()
        return {...category, id: id}

      } catch (error) {
        commit('setError', error)
        throw error
      }
    },
  }
}