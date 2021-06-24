<template>
  <div>
    <div class="page-title">
      <h3>{{'Planning' | localize}}</h3>
      <h4 v-show="(info.bill)">{{ info.bill | currency('UAH')}}</h4>
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!categories.length">{{'Message_NoCategories' | localize}} <router-link to="/categories">{{'Message_CreateNewCategory' | localize}}</router-link> </p>

    <section v-else>
      <div v-for="cat in noLimitCategories" :key="cat.id">
        <p>
          <strong>{{ cat.title }}:</strong>
          {{ cat.spend | currency('UAH') }} из {{ cat.limit | currency('UAH') }}
        </p>
        <div class="progress" v-tooltip="cat.tooltip">
          <div
              class="determinate"
              :class="cat.progressColor"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'palnning',
  metaInfo() {
    return {
      title: this.$title('Planning')
    }
  },
  data() {
    return {
      loading: true,
      categories: [],
    }
  },
  computed: {
    ...mapGetters(['info']),
    noLimitCategories () { // фильтруем категории - ТОЛЬКО с лимитом
      const noLimitCat = this.categories.filter( (cat) => {
        return cat.limit > 0
      })
      return noLimitCat
    }, 
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecord')
    const categories = await this.$store.dispatch('fetchCategories')

    if (records && categories) {
    this.categories = categories.map(cat => {
      const spend = records
        .filter(r => r.categoryId === cat.id) // фильтруем совпадения записей с этой категорией
        .filter(r => r.type === 'outcome')
        .reduce((total = 0, record) => {
          return total += +record.amount
        }, 0)
        const percent = 100 * spend / cat.limit
        const  progressPercent = percent > 100 ? 100 : percent
        const  progressColor = percent < 60
          ? 'green'
          : percent < 100
            ? 'yellow'
            : 'red'
        const tooltipValue = cat.limit - spend
        const tooltip = `${tooltipValue < 0 
          ? 'Message_Excess' 
          : 'Message_Left'}`
      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip,
        tooltipValue,
      }
    })

    }

    this.loading = false
  },
}
</script>