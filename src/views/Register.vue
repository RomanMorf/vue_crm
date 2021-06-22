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

        <div class="input-field">
          <input
              id="name"
              type="text"
              :class="{invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength)}"
              v-model.trim="name"
          >
          <label for="name">Имя</label>
          <small 
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.required"
            >Поле не должно быть пустым
          </small>          
          <small 
            class="helper-text invalid"
            v-if="$v.name.$dirty && !$v.name.minLength"
            >Поле не должно быть пустым
          </small>
          <small 
              class="helper-text invalid"
              v-if="$v.name.$dirty && !$v.name.minLength"
            >Длинна пароля должна быть минимум {{ this.$v.name.$params.minLength.min }} символов. Сейчас он {{ password.length }}</small>

        </div>
        <p>Выберите язык:
          <label class="radio">
            <input type="radio" 
              v-model="locale"
              checked
              :value='"ru-RU"'
            />
            <span>Русский</span>
          </label>
          <label class="radio">
            <input type="radio" 
              v-model="locale"
              :value='"en-US"'
            />
            <span>English</span>
          </label>
        </p>
        <p class="checkbox">
          <label>
            <input type="checkbox" 
              v-model="agree"
            />
            <span>С правилами согласен</span>
          </label>
        </p>
      </div>
      <div class="card-action">
        <div>
          <button
              class="btn waves-effect waves-light auth-submit"
              type="submit"
          >
            Зарегистрироваться
            <i class="material-icons right">send</i>
          </button>
        </div>

        <p class="center">
          Уже есть аккаунт?
          <router-link to="/login" >Войти!</router-link>
        </p>
      </div>
    </form>
    <!-- <button @click="testReg">test register</button> -->

  </div>
</template>


<script>
import {email, required, minLength} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'

export default {
  name: 'register',

  data: () => ({
    email: '',
    password: '',
    name: '',
    locale: 'ru-RU',
    agree: false,
  }),

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
        name: this.name,
        locale: this.locale || 'ru_RU',
      }

      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        await this.$store.dispatch('register', formDara)
        this.$router.push('/?message=wellcome')
      } catch (error) {
        if (messages[error.code]) {
          // this.$message(messages[error.code])
          throw error
        }

      }
    },

    // // test -------------------------------------------------
    // async testReg () {
    //   function getRandomInt(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    //   }
    //   const formDara = {
    //     email: this.email || `roman_morf${getRandomInt(5, 115)}@ukr.net`,
    //     password: this.password || '123456789',
    //     name: this.name || 'testName - romario',
    //     tel: '2225544',
    //     gender: 'male'
    //   }
    //   // const formDara = {
    //   //   email: this.email,
    //   //   password: this.password,
    //   //   mane: this.name,
    //   // }
    //   console.log(formDara, 'formDara');

    //   try {
    //     await this.$store.dispatch('register', formDara)
    //     console.log('try this.$store.dispatch');
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // // test -------------------------------------------------
  },

  destroyed() { 
    window.M.Toast.dismissAll();
  },

}
</script>

<style scoped>
  .radio {
    margin-right: 10px;
  }
  .card .card-content p.checkbox {
    margin-top: 10px;
  }
</style>