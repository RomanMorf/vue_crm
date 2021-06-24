<template>

<div>
  <Loader v-if="loading"/>
  <div v-else-if="record">
    <div class="breadcrumb-wrap">
      <router-link to="/history" class="breadcrumb">{{'Menu_History' | localize}}</router-link>
      <a @click.prevent class="breadcrumb">
        {{ recType }}
      </a>
    </div>
    <div class="row">
      <div class="col s12 m12">
        <div>
          <div class="card-content black-text">
              <button 
                @click="btnEdit"
                v-show="edit"
                class="btn-small btn right" 
                v-tooltip='"Btn_Edit"'
              >
              <i class="material-icons">edit</i>
              </button>              
              <button 
                @click="btnCancel"
                v-show="!edit"
                class="btn-small btn right" 
                v-tooltip='"Btn_Cancel"'
              >
              <i class="material-icons">cancel</i>
              </button>


            <p v-show="record.description">{{'Message_Description' | localize}}: {{ record.description }}</p>
            <input 
            id="description"
            v-model="record.description"
            v-show="!edit"
            :placeholder="textForPlaceholder"
            >

            
            <p>{{'Message_Sum' | localize}}: {{ record.amount | currency }}</p>
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
                <span>{{'HistoryTable_Income' | localize}}</span>
              </label>

              <label v-show="!edit">
                <input
                  class="with-gap"
                  name="type"
                  type="radio"
                  value="outcome"
                  v-model="record.type"
                />
                <span>{{'HistoryTable_Outcome' | localize}}</span>
              </label>
            </p>

            <br v-show="!edit">
            <p v-show="edit">{{'HistoryTable_Category' | localize}}: {{ record.categoryName }}</p>
            <p v-show="!edit">{{'HistoryTable_Category' | localize}}: </p>
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


            <small>{{'Message_RecordCreated' | localize}}: {{ record.date | date('datetime')}}</small>
              <button 
                @click="btnSave"
                v-show="!edit"
                class="btn-small btn right" 
                v-tooltip='"Btn_Save"'
              >
              <i class="material-icons">save</i>
              </button>

          </div>
        </div>
      </div>
    </div>
  </div>
  <p class="center" v-else> {{'Message_RecordWithId' | localize}}={{$route.params.id}} {{'Message_NotFound' | localize}}</p>
</div>

</template>

<script>
import localizeFilter from '@/filters/localize.filter' // импортируем фильтр

export default {
  name: 'edit',
  metaInfo() {
    return {
      title: this.$title('Edit')
    }
  },

  data() {
    return {
      loading: true,
      record: null,
      edit: true,
      categories: null,
      current: null,
      id: '',
      diference: null,
    }
  },
  methods: {
    btnEdit() { // кнопка редактировать
      this.edit = false

    },
    btnSave() { // кнопка сохранить изменения
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
    btnCancel() { // кнопка отмены редактирования
      this.edit = true
      this.cancelEdit()
    },
    async cancelEdit() { // отменить редактирование и загрузить данные снова
      this.loading = true

      const id = this.$route.params.id
      const record = await this.$store.dispatch('fetchRecordById', id)
      const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)
      this.categories = await this.$store.dispatch('fetchCategories')
      this.current = record.categoryId
      
      window.M.updateTextFields();

      this.record = {
        ...record,
        categoryName: category.title
      }

      this.loading = false
    },
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

    this.diference = this.record.amount

    this.loading = false
  },
  destroyed() { // очищаем кеш селектора, при переходе на другую тсраницу
    if (this.elect && this.select.destroy) {
      this.select.destroy()
    }
  },
  computed: {
    recType () {
      if (this.record.type === 'income') {
        return localizeFilter('HistoryTable_Income')
      }
      return localizeFilter('HistoryTable_Outcome')
    },
    textForPlaceholder() {
      return localizeFilter('Message_EnterDescription')
    }
  },

}
</script>