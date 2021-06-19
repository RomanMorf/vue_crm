import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth";
import info from "./info";
import category from "./category";
import record from "./record";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error
    },
    clearError(state) {
      state.error = null
    },
  },
  actions: {
    async fetchCurrency() { // запрос через fixer.io
      //запрос на сервер. в коце, после &symbols - указать только интересующие валюты. елси оставить пустым - будут все курсы
      const key = process.env.VUE_APP_FIXER_NEW
      const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,RUB,UAH`) 
      
      return await res.json()
    },
    async fetchCurrencyPrivatBank() { // запрос через ПриватБанк
      const res = await fetch(`https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`) 
      return await res.json()
    }
  },
  getters: {
    error: s => s.error
  },
  modules: {
    auth,
    info,
    category,
    record,
  },
});
