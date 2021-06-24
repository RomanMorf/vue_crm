<template>
  <div>
    <div class="page-title">
      <h3>{{'Menu_Record' | localize}}</h3>
    </div>

  <Loader v-if="loading"/>

  <p class="center" v-else-if="!categories">{{'Message_NoCategories' | localize}}. <router-link to="/categories">{{'Message_CreateNewCategory' | localize}}</router-link> </p>

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
      <label>{{'Message_ChooseCategory' | localize}}</label>
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
        <span>{{'HistoryTable_Income' | localize}}</span>
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
        <span>{{'HistoryTable_Outcome' | localize}}</span>
      </label>
    </p>

    <div class="input-field">
      <input
          id="amount"
          type="number"
          v-model="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
      >
      <label for="amount">{{'Message_Sum' | localize}}</label>
      <span 
        class="helper-text invalid"
        v-if="$v.amount.$dirty && !$v.amount.minValue"
        >{{'Message_MinimalAmount' | localize}} {{ $v.amount.$params.minValue.min }}</span>
    </div>

    <div class="input-field">
      <input
          id="description"
          type="text"
          v-model="description"
      >
      <label for="description">{{'Message_Description' | localize}}</label>
    </div>

    <button class="btn waves-effect waves-light" type="submit">
      {{'Btn_Create' | localize}}
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