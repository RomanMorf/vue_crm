<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <Loader v-if="loading"/>

    <div v-else>
      <form  class="form" @submit.prevent="submitHandler">

        <div class="input-field">
          <input
            id="description"
            type="text"
            v-model="name"
            :class="{invalid: $v.name.$dirty && !$v.name.required}"
          >
          <label for="description">{{ 'Name' | localize }}</label>
          <small 
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
            >{{ 'Message_EnterName' | localize}}
          </small>
        </div>
        <p class="email">Email: {{ currentUser.email }} <span class="email_confirmed" v-show="currentUser.emailVerified" v-tooltip='"Message_EmailConfirmed"'
></span></p> 
        <p class="small">{{ currentUser.emailVerified ? 'Почта подтверждена' : 'необходимо подтвердить Email' }}</p>

        <div>
          <input 
            type="password" 
            placeholder="Edit pass"
            v-model="newPassword"
          > 
          <input 
            type="password" 
            placeholder="Confirm pass"
            v-model="newPasswordCheck"
          > 
          <button 
            class="btn waves-effect waves-light"
            @click="editPass"
          >Edit Pass</button>

          <input 
            type="email" 
            placeholder="Edit email"
            v-model="newEmail"
          > 
          <button 
            @click="editEmail"
            class="btn waves-effect waves-light"
          >Edit email</button>
        </div>

        <p>Аккаунт создан: {{ currentUser.metadata.creationTime | date('date') }}</p>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Btn_Update' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>

      <LangSwitch/>

      <div v-show="testZone" class="border">
        <p class="center">Test zone</p>
        <p>
          <input v-model="date" type="datetime-local">
        </p>
        <p>{{ date }}</p>
        <button class="btn waves-effect waves-light" @click="showDate">
          Редактировать
          <i class="material-icons right">edit</i>
        </button>
        <p>Tel: {{ currentUser.phoneNumber }}</p>
      </div>

    </div>

    <Popup />

  </div>
</template>

<script>
import firebase from 'firebase/app'
import "firebase/auth"

import {mapGetters, mapActions} from 'vuex'
import {required, email} from 'vuelidate/lib/validators'
import LangSwitch from '@/components/LangSwitch'
import messages from '@/utils/messages'
import Popup from '@/components/Popup'

export default {
  metaInfo() {
    return {
      title: this.$title('ProfileTitle')
    }
  },
  data() {
    return {
      loading: true,
      name: '',
      isRuLocale: true,


      testZone: false,
      date: '',
      user: null,
      newEmail: '',
      newPassword: '',
      newPasswordCheck: '',
      currentUser: firebase.auth().currentUser,
      code: '123123Romario',
    }
  },
  computed: {
    ...mapGetters(['info']),
    Popup
  },
  validations: {
    name: {required},
    newEmail: {required, email},
    newPassword: {required},
  },
  methods: {
    ...mapActions(['updateInfo']),

    async submitHandler() { // отправить форму
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
      } catch (e) {
        console.log(e);
        throw e
      }
    },
    editPass() { // редактировать пароль
      this.loading = true

      if (this.newPassword !== this.newPasswordCheck) {
        alert('Пароли не совпадают')
        this.loading = false
        return
      }
        let lang = ''
        switch (this.$store.getters.info.locale) {
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

      this.currentUser.updatePassword(this.newPassword).then(() => {
        // Update successful.
          this.$message(messages[lang + 'passWasChange'])
      }).catch((error) => {
        // An error ocurred
        // ...
        if (messages[error.code]) {
          this.$message(messages[lang + error.code])
          throw error
        }
        throw error
      });

      this.newPassword = ''
      this.newPasswordCheck = ''

      this.loading = false

    },
    editEmail() { // редактировать Email
      this.loading = true
      this.currentUser.updateEmail(this.newEmail).then(() => {
        // Update successful
        // ...
        firebase.auth().currentUser.sendEmailVerification()
          .then(() => {
            // Email verification sent!
            // ...
          });
      this.loading = false

      }).catch((error) => {
        // An error occurred
        // ...
        throw error
      });

    },
    showDate() { // показать дату в консоль
      console.log(this.currentUser.metadata.creationTime, 'currentUser.metadata.creationTime');
      console.log(this.date, 'date');
    },

  },
  mounted() {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'

    setTimeout(() => { // необходимо вызывать рефенцию серез задержку, чтобы он успел проинициализироваться
      window.M.updateTextFields()
    })

    this.loading = false
  },
  components: {
    LangSwitch
  }
}
</script>

<style scoped>
  .switch {
    margin-bottom: 2rem;
  }
  .border {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid red;
  }
  .email {
    position: relative;
  }
  .email_confirmed {
    position: absolute;
    top: 0;
    border: 1px solid green;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    background-color: green;
  }
</style>