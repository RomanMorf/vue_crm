<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <Loader v-if="loading"/>


    <form v-else class="form" @submit.prevent="submitHandler">

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

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Btn_Update' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>

    <div v-show="testZone">
      <p>Test zone</p>
      <p>Аккаунт создан: {{ currentUser.metadata.creationTime | date('date') }}</p>
      <p>Email: {{ currentUser.email }}</p>
      <p>{{ currentUser.emailVerified ? 'Почта подтверждена' : 'необходимо подтвердить Email' }}</p>
      <p>Tel: {{ currentUser.phoneNumber }}</p>

      <button @click.prevent="confirmPass">Confirm Password</button>
      <button @click.prevent="resetPass">Reset Password</button>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase/app'
import {mapGetters, mapActions} from 'vuex'
import {required} from 'vuelidate/lib/validators'

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



      user: null,
      testZone: false,
      currentUser: firebase.auth().currentUser,
      code: '123123Romario',
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  validations: {
    name: {required},
  },
  methods: {
    ...mapActions(['updateInfo']),

    async submitHandler() {
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
    //----------------------------------
    async resetPass(){
      this.loading = true
      await firebase.auth().sendPasswordResetEmail(this.currentUser.email)
      this.loading = false
    },
    async confirmPass() {
      this.loading = true
      await firebase.auth().confirmPasswordReset('Fsdja9023SEreqH', '99999999').then(() => {
        // Reset was successful
        console.log("Success");
      }).catch(error => {
        console.error(error) 
        throw error
      })
      this.loading = false
    },
    //------------------------------------

  },
  mounted() {
    this.name = this.info.name
    this.isRuLocale = this.info.locale === 'ru-RU'

    setTimeout(() => { // необходимо вызывать рефенцию серез задержку, чтобы он успел проинициализироваться
      window.M.updateTextFields()
    })

    this.loading = false
  },
}
</script>

<style scoped>
  .switch {
    margin-bottom: 2rem;
  }
</style>