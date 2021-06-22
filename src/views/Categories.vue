<template>
<div>
  <div class="page-title">
    <h3>Категории</h3>
  </div>
  <section>

    <Loader v-if="loading"/>

    <div v-else class="row">

      <CategoryCreate @created="addNewCategory"/>

      <CategoryEdit 
        v-if="categories"
        :categories="categories"
        :key="categories.length + updateCount"
        @update="updateCategories"
        />

        <p class="center" v-else>Категорий пока нет...</p>

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
    addNewCategory (category) {
      this.categories.push(category)
    },
    updateCategories(editedCategory) {
      // this.categories.forEach(cat => {
      //   if (cat.id == editedCategory.id) {
      //     cat.title = editedCategory.title
      //     cat.limit = editedCategory.limit
      //     console.log(this.categories, 'this.categories');
      //   }
      // });
      const index = this.categories.findIndex(c => c.id === editedCategory.id)
      this.categories[index].title = editedCategory.title
      this.categories[index].limit = editedCategory.limit
      this.updateCount++
    }
  },
  components: {
    CategoryCreate,
    CategoryEdit
  }
}
</script>

