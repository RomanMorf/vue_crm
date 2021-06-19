<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>

      <Loader v-if="loading" />

    <div v-else class="row">

      <HomeBill
        :rates="currencyRates"
        />

      <HomeCurrencyPivatBank
        :rates="currencyRates"
        />

    </div>
  </div>

</template>

<script>
import HomeBill from '@/components/HomeBill.vue'
import HomeCurrencyPivatBank from '@/components/HomeCurrencyPivatBank.vue'
// import messages from '@/utils/messages'

export default {
  name: "Home",
  data: () => ({
    loading: true,
    currencyRates: null,
  }),
  async mounted() {
    this.currencyRates = await this.$store.dispatch('fetchCurrencyPrivatBank')
    this.loading = false
    // if (messages[this.$route.query.message]) {
    //   this.$message(messages[this.$route.query.message])
    // }

  },
  methods: {
    async refresh() {
      
      this.loading = true

      try {
        this.currencyRates = await this.$store.dispatch('fetchCurrencyPrivatBank')
        await this.$store.dispatch('fetchInfo')

      } catch (error) {
        this.$message('Error', error)
        throw error
      }

      this.loading = false
    }
  },
  components: {
    HomeBill,
    HomeCurrencyPivatBank
  }
};
</script>
