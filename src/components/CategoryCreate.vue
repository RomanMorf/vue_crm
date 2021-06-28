<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Btn_Create' | localize}}</h4>
      </div>

      <form autocomplete="off" @submit.prevent="submitHandler">
        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model.number="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'Message_EnterCategoryName' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            {{'Message_CategoryName' | localize}}
          </span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model="limit"
          >
          <label for="limit">{{'Message_Limit' | localize}}</label>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Btn_Create' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators' // импортируем валидаторы

export default {
  data() {
    return {
      title: '',
      limit: '',
    }
  },
  validations: {
    title: {required},
  },
  mounted() {
    window.M.updateTextFields();
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const category = await this.$store.dispatch('createCategory', {
        title: this.title,
        limit: this.limit
      })

      this.$message(`Категория ${this.title} была создана`)
      this.title = ''
      this.limit = ''
      this.$v.$reset() // очищаем поля категории и фильтры валидации
      this.$emit('created', category)

      } catch (error) {
        console.log(error);
        throw error
      }
      
    }
  },
}
</script>