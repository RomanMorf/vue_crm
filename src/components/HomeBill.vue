<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue">
      <div class="card-content white-text">
        <span class="card-title">Счет в валюте</span>

        <p 
          v-for="(rate, index ) in rates"
          :key="index"
          class="currency-line">
          <span>{{getCurrency(index)}} {{rate.ccy}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default ({
  props: ['rates'],
  computed: {
    base() {
      return this.$store.getters.info.bill
    },
  },
  methods: {
    getCurrency(curIndex) {
      const mergeRate = (+this.rates[curIndex].buy + +this.rates[curIndex].sale ) / 2
      return (this.base / mergeRate).toFixed(3)
    }
  },
})
</script>
