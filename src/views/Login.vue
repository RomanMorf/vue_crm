<template>
<div>
  <form class="card auth-card" @submit.prevent="submitHandler">
      <div class="card-content">
        <span class="card-title">Домашняя бухгалтерия</span>
        <div class="input-field">
            <input
              id="email"
              type="text"
              v-model.trim="email"
              :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
            >
            <label for="email">Email</label>
            <small 
              class="helper-text invalid"
              v-if="$v.email.$dirty && !$v.email.required"
            >Поле Email не должно быть пустым</small>
            <small 
              class="helper-text invalid"
              v-else-if="$v.email.$dirty && !$v.email.email"
            >Введите корректный Email</small>
        </div>
        <div class="input-field">
            <input
              id="password"
              type="password"
              :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
              v-model.trim="password"
            >
            <label for="password">Пароль</label>
            <small 
              class="helper-text invalid"
              v-if="$v.password.$dirty && !$v.password.required"
            >Введите пароль</small>
            <small 
              class="helper-text invalid"
              v-if="$v.password.$dirty && !$v.password.minLength"
            >Длинна пароля должна быть минимум {{ this.$v.password.$params.minLength.min }} символов. Сейчас он {{ password.length }}</small>
        </div>
      </div>
      <div class="card-action">
        <div>
            <button
              class="btn waves-effect waves-light auth-submit"
              type="submit"
            >
            Войти
            <i class="material-icons right">send</i>
            </button>
        </div>

        <p class="center">
            Нет аккаунта?
            <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </div>
  </form>
</div>
</template>

<script>
import {email, required, minLength} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'



export default {
  name: 'login',

  data: () => ({
    email: '',
    password: '',
  }),

  validations: { // настраиваем валидаторы
    email: {email, required},
    password: {required, minLength: minLength(2)}, // минимальная длинна пароля
  },

  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }

  },

  methods: {
    async submitHandler () {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const formDara = {
        email: this.email,
        password: this.password,
      }

      // console.log(formDara);

      try {
        await this.$store.dispatch('login', formDara)
        this.$router.push('/')
        // this.$message('Добро пожаловать')

      } catch (error) {
        if (messages[error.code]) {
          this.$message(messages[error.code])
          throw error
        }
      }
    },
  },

}
</script>

