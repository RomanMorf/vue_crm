<template>
  <div>
    <div class="page-title">
      <h3>{{'Menu_Bill' | localize}}: {{info.bill | currency('UAH')}}</h3>

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
import messages from '@/utils/messages'
import {mapGetters} from 'vuex'

export default {
  name: "Home",
  metaInfo() {
    return {
      title: this.$title('Bill')
    }
  },

  data: () => ({
    loading: true,
    currencyRates: null,
  }),
  async mounted() {
    this.currencyRates = await this.$store.dispatch('fetchCurrencyPrivatBank')
    this.loading = false
  },
  methods: {
    async refresh() {
    
      this.loading = true
      try {
        this.currencyRates = await this.$store.dispatch('fetchCurrencyPrivatBank')
        await this.$store.dispatch('fetchInfo')
      } catch (error) {
        if (messages[error.code]) {
          this.$message(messages[error.code])
          throw error
        }
      }
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(['info'])
  },

  components: {
    HomeBill,
    HomeCurrencyPivatBank
  }
};
</script>
