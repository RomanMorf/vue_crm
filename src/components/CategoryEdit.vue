<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Btn_Edit' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field" >
          <select ref="select" v-model="current" >
            <option
              v-for="c of categories"
              :key="c.id"
              :value="c.id"
              >
              {{c.title}}
            </option>
          </select>
          <label>{{'Message_ChooseCategory' | localize}}</label>
        </div>

        <div class="input-field">
          <input
              id="name_edit"
              type="text"
              v-model="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"

          >
          <label for="name_edit">{{'Message_EnterCategoryName' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"

          >
            {{'Message_EnterCategoryName' | localize}}
          </span>
        </div>

        <div class="input-field">
          <input
              id="limit_edit"
              type="number"
              v-model.number="limit"
              :class="{invalid: $v.limit.$dirty && this.limit < $v.limit.minValue}"
          >
          <label for="limit_edit">{{'Message_Limit' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{'Message_MinimalAmount' | localize}} {{ $v.limit.$params.minValue.min }}
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Btn_Edit' | localize}}
          <i class="material-icons right">send</i>
        </button>
        <button class="btn waves-effect waves-light ml-10" @click.prevent="categoryDelete">
          {{'Btn_Delete' | localize}}
          <i class="material-icons right">delete</i>
        </button>
      </form>
    </div>
  </div>

</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      select: null,
      title: '',
      limit: '',
      id: '',
      current: null,
    }
  },
  methods: {
    async submitHandler() { // редактировать категорию
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const editetCategory = {
        title: this.title,
        limit: this.limit,
        id: this.id
      }
      await this.$store.dispatch('editCategory', editetCategory)
      this.$message('Категория успешно обновлена')
      this.$emit('update', editetCategory)
      } catch (error) {
        console.log(error);
        throw error
      }
    },
    async categoryDelete() { // удалить категорию
      try {
        const categoryForDelete = {
        id: this.id
        }
        await this.$store.dispatch('deleteCategory', categoryForDelete)

        this.$message('Категория была удалена')
        this.$emit('deleteCat', categoryForDelete)
        
        setTimeout(() => {
          this.select = window.M.FormSelect.init(this.$refs.select);
        }, 0)

        this.title = ''
        this.limit = ''
        this.id = ''

      } catch (error) {
        if (messages[error.code]) {
          this.$message(messages[error.code])
          throw error
        }
      }

    }
  },
  validations: {
    title: {required},
    limit: {minValue: minValue(0)},
  },
  created() { // получаем начальные значения для полей
    const {id, title, limit} = this.categories[0]
    this.id = id
    this.title = title
    this.limit = limit
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
    }, 0)

  },
  mounted() {
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
    }, 0)

    if (this.categories.length) {
      this.current = this.categories[0].id
    }
    
    window.M.updateTextFields();

  },
  destroyed() { // очищаем кеш селектора, при переходе на другую тсраницу
    if (this.elect && this.select.destroy) {
      this.select.destroy()
    }
  },
  watch: {  // следим за обновлениями в данном объекте
    current(catId) {
      const {title, limit} = this.categories.find(c => c.id === catId)
      this.title = title
      this.limit = limit
      this.id = catId
    }
  }
}
</script>

<style scoped>
  .btn.waves-effect.waves-light.ml-10 {
    margin-left: 20px;
  }
</style>