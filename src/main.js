import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Paginate from 'vuejs-paginate'
import dateFilter from '@/filters/date.filter' // импортируем фильтр
import currencyFilter from '@/filters/currency.filter' // импортируем фильтр
import messagePlugin from '@/utils/message.plugin' // импортируем наш плагин сообщений
import firebase from 'firebase/app'
import Loader from '@/components/app/Loader.vue'
import tooltipDirective from '@/directives/tooltip.directive'
import 'firebase/auth';
import 'firebase/database';


import "./registerServiceWorker";
import 'materialize-css/dist/js/materialize.min'


Vue.config.productionTip = false

Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp({
  apiKey: "AIzaSyBhgPL2NS8nTaj4e8IUo4p0SNDYbze1k3w",
  authDomain: "romario-web-app-e91d4.firebaseapp.com",
  databaseURL: "https://romario-web-app-e91d4-default-rtdb.firebaseio.com",
  projectId: "romario-web-app-e91d4",
  storageBucket: "romario-web-app-e91d4.appspot.com",
  messagingSenderId: "609301682459",
  appId: "1:609301682459:web:19a68a509f7a4fb1a5dbbe",
  measurementId: "G-1G5K4KXH5Z"
});


Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.filter('date', dateFilter); // создаем фильтр и передаем в него настройки
Vue.filter('currency', currencyFilter); // создаем фильтр и передаем в него настройки
Vue.directive('tooltip', tooltipDirective); // глобально регистрируем директиву

let app;

firebase.auth().onAuthStateChanged( () => {
  if (!app) {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
  
  
})
