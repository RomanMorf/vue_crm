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

    <div class="center">
      <button class="btn waves-effect waves-light" @click="showGraph = !showGraph" v-show="!showGraph">{{'Btn_ShowGraph' | localize}}</button>
      <button class="btn waves-effect waves-light" @click="showGraph = !showGraph" v-show="showGraph">{{'Btn_HideGraph' | localize}}</button>
    </div>

    <div class="center radio_btn" v-show="showGraph">
      <label class="radio mr-5">
        <input type="radio" 
          v-model="tableType"
          checked
          :value='"outcome"'
        />
        <span>{{'HistoryTable_Outcome' | localize}}</span>
      </label>
      <label class="radio">
        <input type="radio" 
          v-model="tableType"
          :value='"income"'
        />
        <span>{{'HistoryTable_Income' | localize}}</span>
      </label>
    </div>

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
      tableType: 'outcome'
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
    deleteRecord(recordId) { // удалить запись
      var indexforDel = ''
      this.records.forEach((r, index) => {
        if (r.id === recordId) {
          indexforDel = index
        }
      })
      this.records.splice(indexforDel, 1)

      this.setup();
    },
    async setup() { // отрисовать график и пагинацию
      const categories = await this.$store.dispatch('fetchCategories')

      this.setupPagination(this.records.map(record => { // отрисовать пагинацию
        var catName = ''
        categories.forEach( (c) => {
          if (record.categoryId === c.id) {
            catName = c.title
          }
        })
        

        return {
          ...record,
          categoryName: catName || localizeFilter('HistoryTable_Deleted'),
          typeClass: record.type === 'income' ? 'green' : 'red',
          typeText: record.type === 'income' 
            ? localizeFilter('HistoryTable_Income') 
            : localizeFilter('HistoryTable_Outcome'),
        }
      }))

      this.renderChart({ // отрисовать график
        labels: categories.map(c => c.title),
        datasets: [{
            label: 'Расходы по категориям',
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === this.tableType) {
                  total += +r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 199, 232, 0.2)',
                'rgba(154, 62, 35, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(105, 159, 64, 0.2)',
                'rgba(179, 152, 225, 0.2)',
                'rgba(200, 170, 80, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 199, 232, 1)',
                'rgba(154, 62, 35, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(105, 159, 64, 1)',
                'rgba(179, 152, 225, 1)',
                'rgba(200, 170, 80, 1)'
            ],
            borderWidth: 1
        }]
      }, this.options)
    },
  },
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
  },
  watch: { 
    tableType() { // смена вида таблицы в зависимости от значения
      this.setup();
    }
  },
  

}
</script>

<style scoped>
  .radio_btn{
    margin-top: 10px;
  }
  .mr-5 {
    margin-right: 5px;
  }
</style>