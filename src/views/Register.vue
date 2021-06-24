<template>
  <div >
    <form class="card auth-card" @submit.prevent="submitHandler" >
      <div class="card-content">
        <span class="card-title">{{'RegistrationForm' | localize}}</span>

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
            <small 
              class="helper-text invalid"
              v-if="$v.password.$dirty && !$v.password.minLength"
            >{{'Message_PassMinLength' | localize}} {{ this.$v.password.$params.minLength.min }} {{'Message_PassMinLength' | localize}} {{ password.length }}</small>
        </div>

        <div class="input-field">
            <input
              id="passwordCopy"
              type="password"
              :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
              v-model.trim="passwordCopy"
            >
            <label for="passwordCopy">{{'Message_RepeatPass' | localize}}</label>
            <small 
              class="helper-text invalid"
              v-if="password != passwordCopy"
            >{{'Message_PassMustMatch' | localize}}</small>
        </div>

        <div class="input-field">
          <input
              id="name"
              type="text"
              :class="{invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)}"
              v-model.trim="name"
          >
          <label for="name">{{'Name' | localize}}</label>
          <small 
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
            >{{'Message_EnterName' | localize}}
          </small>          
          <small 
              class="helper-text invalid"
              v-if="$v.name.$dirty && !$v.name.minLength"
            >{{'Message_NameMinKength' | localize}} {{ this.$v.name.$params.minLength.min }}</small>

        </div>

        <LangSwitch
          @localeEmit="catchLocale"
        />

        <p class="checkbox">
          <label>
            <input type="checkbox" 
              v-model="agree"
            />
            <span>{{'Message_RulsAgree' | localize}}</span>
          </label>
        </p>
      </div>
      <div class="card-action">
        <div>
          <button
              class="btn waves-effect waves-light auth-submit"
              type="submit"
          >
            {{'Btn_Register' | localize}}
            <i class="material-icons right">send</i>
          </button>
        </div>

        <p class="center">
          {{'Message_HaveAccount' | localize}}
          <router-link to="/login" >{{'Message_LogIn' | localize}}!</router-link>
        </p>
      </div>
    </form>
  </div>
</template>


<script>
import {email, required, minLength} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'
import LangSwitch from '@/components/LangSwitch'
import store from '@/store'

export default {
  name: 'register',

  data() {
    return {
      email: '',
      password: '',
      passwordCopy: '',
      name: '',
      agree: false,
      locale: this.$store.getters.info.locale,
    }
  },

  validations: { // настраиваем валидаторы
    email: {email, required},
    password: {required, minLength: minLength(7)}, // минимальная длинна пароля
    name: {required, minLength: minLength(2)},
    agree: {checked: v => v},

  },

  methods: {
    async submitHandler () {
      const formDara = {
        email: this.email,
        password: this.password,
        passwordCopy: this.passwordCopy,
        name: this.name,
        locale: this.locale,
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        await this.$store.dispatch('register', formDara)
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
    catchLocale(locale) {
      this.locale = locale
    },
  },
  components: {
    LangSwitch
  },

  destroyed() { 
    window.M.Toast.dismissAll();
  },
}
</script>

<style scoped>
  p.checkbox {
    margin-top: 10px;
  }
  .radio {
    margin-right: 10px;
  }
</style>