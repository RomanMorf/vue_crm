<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <Loader v-if="loading"/>

    <form v-else class="form">
      <p>Аккаунт создан: {{ currentUser.metadata.creationTime | date('date') }}</p>
      <p>Email: {{ currentUser.email }}</p>
      <p>{{ currentUser.emailVerified ? 'Почта подтверждена' : 'необходимо подтвердить Email' }}</p>
      <p>Tel: {{ currentUser.phoneNumber }}</p>

      <button @click.prevent="confirmPass">Confirm Password</button>
      <button @click.prevent="resetPass">Reset Password</button>

      <div class="input-field">
        <input
            id="description"
            type="text"
        >
        <label for="description">Имя</label>
        <span
              class="helper-text invalid">name</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  data() {
    return {
      loading: true,
      user: null,
      currentUser: firebase.auth().currentUser,
      code: '123123Romario'
    }
  },
  methods: {
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
    }
  },
  mounted() {
    // this.user = this.$store.dispatch('getUserData')
    // const uid = this.$store.dispatch('getUid')
    // console.log(this.user, 'this.user');
    // console.log(uid, 'uid');
    console.log(firebase.auth().currentUser, 'firebase.auth().currentUser');
    this.loading = false

  },
}
</script>