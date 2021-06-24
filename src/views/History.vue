<template>
  <div>
    <div class="page-title">
      <h3>{{'History_Title' | localize}}</h3> 
    </div>

    <Loader v-if="loading"/>

    <p class="center" v-else-if="!records.length">{{'Message_NoRecords' | localize}} <router-link to="/record">{{'Message_CreateNewRecord' | localize}}</router-link> </p>

    <section v-else>

      <HistoryTable 
      :records='items'
      @indexForDelete="deleteRecord"
      />

      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="prevBtn"
        :next-text="nextBtn"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />

    <button class="btn waves-effect waves-light" @click="showGraph = !showGraph" v-show="!showGraph">{{'Btn_ShowGraph' | localize}}</button>
    <button class="btn waves-effect waves-light" @click="showGraph = !showGraph" v-show="showGraph">{{'Btn_HideGraph' | localize}}</button>

    <div class="history-chart" v-show="showGraph">
      <canvas ref="canvas"></canvas>
    </div>


    </section>
  </div>
</template>

<script>
import HistoryTable from '@/components/HistoryTable'
import paginationMixins from '@/mixins/pagination.mixin'
import { Pie } from 'vue-chartjs'
import localizeFilter from '@/filters/localize.filter' // импортируем фильтр


export default {
  name: 'history',
  metaInfo() {
    return {
      title: this.$title('History')
    }
  },

  extends: Pie,
  mixins: [paginationMixins],
  data() {
    return {
      loading: true,
      records: [],
      categories: [],
      showGraph: false,
    }
  },
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecord')

    this.records.sort(function(a,b){
      var c = new Date(a.date);
      var d = new Date(b.date);
      return d-c;
      })

    this.setup()

    this.loading = false
  },
  methods: {
    deleteRecord(index) {
      this.records.splice(index, 1)
    },
    async setup() {
      const categories = await this.$store.dispatch('fetchCategories')

      this.setupPagination(this.records.map(record => {
        return {
          ...record,
          categoryName: categories.find(c => c.id === record.categoryId).title,
          typeClass: record.type === 'income' ? 'green' : 'red',
          typeText: record.type === 'income' 
            ? localizeFilter('HistoryTable_Income') 
            : localizeFilter('HistoryTable_Outcome'),
        }
      }))

    this.renderChart({
      labels: categories.map(c => c.title),
      datasets: [{
          label: 'Расходы по категориям',
          data: categories.map(c => {
            return this.records.reduce((total, r) => {
              if (r.categoryId === c.id && r.type === 'outcome') {
                total += +r.amount
              }
              return total
            }, 0)
          }),
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
      }, this.options)
    },
  },
  // computed: {
  //   sortedList () {
  //     function compare(a, b) { return a.amount - b.amount }
  //     function sortDate(a,b){
  //       var c = new Date(a.date)
  //       var d = new Date(b.date)
  //       return c-d}
  //     switch(this.sortParam){
  //         case 'date': return this.records.slice(0).sort(sortDate)
  //         case 'amount': return this.records.slice(0).sort(compare)
  //         default: return this.records
  //     }
  //   }
  // },
  components: {
    HistoryTable,
  },
  computed: {
    prevBtn () {
      return localizeFilter('Paginate_Back')
    },
    nextBtn() {
      return localizeFilter('Paginate_Forward')

    },
  }

}
</script>