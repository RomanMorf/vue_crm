<template>
<div>
  <div class="page-title">
    <h3>{{'Menu_Categories' | localize}}</h3>
  </div>
  <section>

    <Loader v-if="loading"/>

    <div v-else class="row">

      <CategoryCreate 
        @created="addNewCategory"
        class="mb-50"
        />

      <CategoryEdit 
        v-if="categories"
        :categories="categories"
        :key="categories.length + updateCount"
        @update="updateCategories"
        @deleteCat="deleteCategory"
        />

        <p class="center" v-else>{{'Message_NoCategories' | localize}}.</p>

    </div>
  </section>
</div>

</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'

export default {
  name: 'categories',
  metaInfo() {
    return {
      title: this.$title('Categories')
    }
  },
  data() {
    return {
      categories: [],
      loading: true,
      updateCount: 0,
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  },
  methods: {
    addNewCategory (category) { // добавить категорию
      this.categories.push(category)
    },
    updateCategories(editedCategory) { // обновить категории
      const index = this.categories.findIndex(c => c.id === editedCategory.id)
      this.categories[index].title = editedCategory.title
      this.categories[index].limit = editedCategory.limit
      this.updateCount++
    },
    deleteCategory(categoryForDelete) { // удалить категорию
      const index = this.categories.findIndex(c => c.id === categoryForDelete.id)
      this.categories.splice(index, 1)
      this.updateCount++
    },
  },
  components: {
    CategoryCreate,
    CategoryEdit
  }
}
</script>

<style scoped>
.mb-50 {
  margin-bottom: 50px;
}
</style>
