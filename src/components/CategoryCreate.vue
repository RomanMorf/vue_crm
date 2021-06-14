<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model.number="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">Ведите название категории</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >
            Введите название
          </span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model="limit"
              :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">Лимит</label>
          <span 
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            Минимальное значение {{ $v.limit.$params.minValue.min }}
          </span>
        </div>


        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators' // импортируем валидаторы

export default {
  data() {
    return {
      title: '',
      limit: '',
    }
  },
  validations: {
    title: {required},
    limit: {minValue: minValue(100)},
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
      this.limit = 100
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