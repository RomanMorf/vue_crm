<template>
<div>
  <form class="card auth-card" @submit.prevent="submitHandler">
      <div class="card-content">
        <span class="card-title">{{'Message_Auth' | localize}}</span>
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
            >{{'Message_EmailCanBeAmpty' | localize}}</small>
            <small 
              class="helper-text invalid"
              v-else-if="$v.email.$dirty && !$v.email.email"
            >{{'Message_EnterCorrectEmail' | localize}}</small>
        </div>
        <div class="input-field">
            <input
              id="password"
              type="password"
              :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
              v-model.trim="password"
            >
            <label for="password">{{'Message_Pass' | localize}}</label>
            <small 
              class="helper-text invalid"
              v-if="$v.password.$dirty && !$v.password.required"
            >{{'Message_EnterPass' | localize}}</small>
        </div>

        <LangSwitch/>

      </div>
      
      <div class="card-action">
        <div>
            <button
              class="btn waves-effect waves-light auth-submit"
              type="submit"
            >
            {{'Message_LogIn' | localize}}
            <i class="material-icons right">send</i>
            </button>
        </div>

        <p class="center">
            {{'Message_HaveNoAccount' | localize}}
            <router-link to="/register">{{'Btn_Register' | localize}}</router-link>
        </p>
      </div>
  </form>
</div>
</template>

<script>
import {email, required} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'
import LangSwitch from '@/components/LangSwitch'
import store from '@/store'


export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      locale: store.getters.info.locale || 'ru-RU',
    }
  },
  validations: { // настраиваем валидаторы
    email: {email, required},
    password: {required}, // минимальная длинна пароля
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

      try {
        await this.$store.dispatch('login', formDara)
        this.$router.push('/')

      } catch (error) {
        let lang = ''
        switch (store.getters.info.locale) {
          case 'en-US':
            lang = 'EN_'
            break;
          case 'ua-UA':
            lang = 'UA_'
            break;
          default: 
          lang = ''
            break;
        }

        if (messages[error.code]) {
          this.$message(messages[lang + error.code])
          throw error
        }
      }
    },
  },

  components: {
    LangSwitch
  }

}
</script>

