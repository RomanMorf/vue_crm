<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

  <Loader v-if="loading"/>

  <p class="center" v-else-if="!categories">Категорий пока не существует. <router-link to="/categories">Добавить новую категорию</router-link> </p>

  <form v-else class="form" @submit.prevent="submitHandler">
    <div class="input-field" >
      <select ref="select" v-model="category">
        <option 
          v-for="(c, index) in categories"
          :key="index"
          :value="c.id"
        >
          {{ c.title }}
        </option>
      </select>
      <label>Выберите категорию</label>
    </div>

    <p>
      <label>
        <input
          class="with-gap"
          name="type"
          type="radio"
          value="income"
          v-model="type"
        />
        <span>Доход</span>
      </label>
    </p>

    <p>
      <label>
        <input
          class="with-gap"
          name="type"
          type="radio"
          value="outcome"
          v-model="type"

        />
        <span>Расход</span>
      </label>
    </p>

    <div class="input-field">
      <input
          id="amount"
          type="number"
          v-model="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"

      >
      <label for="amount">Сумма</label>
      <span 
        class="helper-text invalid"
        v-if="$v.amount.$dirty && !$v.amount.minValue"
        >Минимальная сумма {{ $v.amount.$params.minValue.min }}</span>
    </div>

    <div class="input-field">
      <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"

      >
      <label for="description">Описание</label>
      <span
            class="helper-text invalid"
            v-if="$v.description.$dirty && !$v.description.required"
            >Поле не должно быть пустым</span>
    </div>

    <button class="btn waves-effect waves-light" type="submit">
      Создать
      <i class="material-icons right">send</i>
    </button>
  </form>
</div>


</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators' // импортируем валидаторы
import {mapGetters} from 'vuex'

export default {
  name: 'record',
  metaInfo() {
    return {
      title: this.$title('Record')
    }
  },
  data() {
    return {
      loading: true,
      categories: [],
      category: null,
      select: null,
      type: 'outcome',
      amount: '',
      description: '',
    }
  },
    validations: {
    amount: {required, minValue: minValue(1)},
    description: {required},
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      } 

      return this.info.bill >= this.amount ? true : false
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
          categoryId: this.category,
          amount: this.amount,
          type: this.type,
          description: this.description,
          date: new Date().toJSON(),
          })

          const bill = this.type === 'income'
            ? +this.info.bill + +this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill})
          this.$message('Запись успешно создана')
          this.$v.$reset() // обнуление формы
          this.amount = ''
          this.description = ''

        } catch (error) {
          this.$message(`Недостаточно средств на счете. Не хватает: (${this.amount - this.info.bill})`)
          throw error
        }
      }
    },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
    if (this.categories) {
      if (this.categories.length) {
        this.category = this.categories[0].id
      }
    }

    setTimeout(() => { // необходимо вызывать рефенцию серез задержку, чтобы он успел проинициализироваться
      this.select = window.M.FormSelect.init(this.$refs.select)
      window.M.updateTextFields();
    }, 0)

    window.M.updateTextFields();
  },
  destroyed() { // очищаем кеш селектора, при переходе на другую тсраницу
    if (this.elect && this.select.destroy) {
      this.select.destroy()
    }
    window.M.Toast.dismissAll();
  },


}
</script>