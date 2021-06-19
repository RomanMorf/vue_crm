<template>

<div>
  <Loader v-if="loading"/>
  <div v-else-if="record">
    <div class="breadcrumb-wrap">
      <router-link to="/history" class="breadcrumb">История</router-link>
      <a @click.prevent class="breadcrumb">
        {{ record.type === 'income' ? 'Доход' : 'Расход' }}
      </a>
    </div>
    <div class="row">
      <div class="col s12 m12">
        <div class="card">
          <div class="card-content black-text">
              <button 
                @click="btnEdit"
                v-show="edit"
                class="btn-small btn right" 
                v-tooltip='"Редактировать запись"'
              >
              <i class="material-icons">edit</i>
              </button>              
              <button 
                @click="btnCancel"
                v-show="!edit"
                class="btn-small btn right" 
                v-tooltip='"Отменить редактирование"'
              >
              <i class="material-icons">cancel</i>
              </button>


            <p>Описание: {{ record.description }}</p>
            <input 
            v-model="record.description"
            v-show="!edit"
            >
            
            <p>Сумма: {{ record.amount | currency }}</p>
            <input 
            type="number"
            v-model="record.amount"
            v-show="!edit"
            >

            <br v-show="!edit">
            <p>
              <label v-show="!edit">
                <input
                  class="with-gap"
                  name="type"
                  type="radio"
                  value="income"
                  v-model="record.type"
                />
                <span>Доход</span>
              </label>

              <label v-show="!edit">
                <input
                  class="with-gap"
                  name="type"
                  type="radio"
                  value="outcome"
                  v-model="record.type"
                />
                <span>Расход</span>
              </label>
            </p>

            <br v-show="!edit">
            <p v-show="edit">Категория: {{ record.categoryName }}</p>
            <p v-show="!edit">Категория: </p>
            <div v-show="!edit">
              <select 
                ref="select" 
                v-model="current" 
              >
                <option
                  v-for="c of categories"
                  :key="c.id"
                  :value="c.id"
                  >
                  {{c.title}}
                </option>
              </select>
            </div>


            <small>{{ record.date | date('datetime')}}</small>
              <button 
                @click="btnSave"
                v-show="!edit"
                class="btn-small btn right" 
                v-tooltip='"Сохранить запись"'
              >
              <i class="material-icons">save</i>
              </button>

          </div>
        </div>
      </div>
    </div>
  </div>
  <p class="center" v-else> Запись с Id={{$route.params.id}} не найдена</p>
</div>

</template>

<script>
export default {
  name: 'detail',
  data() {
    return {
      loading: true,
      record: null,
      edit: true,
      categories: null,
      current: null,
      id: '',
    }
  },
  methods: {
    btnEdit() { // кнопка редактировать
      this.edit = false

    },
    btnSave() { // кнопка сохранить
      this.edit = true
      const editedRecord = {
        amount: this.record.amount,
        categoryId: this.current,
        date: this.record.date,
        description: this.record.description,
        type: this.record.type,
      }
      const id = this.record.id
      this.$store.dispatch('editRecord', {editedRecord, id})
      this.$router.push('/history')
    },
    btnCancel() {
      this.edit = true
    }
  },

  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.categories = await this.$store.dispatch('fetchCategories')

    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
    }, 0)
    this.current = record.categoryId
    
    window.M.updateTextFields();

    this.record = {
      ...record,
      categoryName: category.title
    }

    this.loading = false
  },
  destroyed() { // очищаем кеш селектора, при переходе на другую тсраницу
    if (this.elect && this.select.destroy) {
      this.select.destroy()
    }
  },
}
</script>