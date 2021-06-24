<template>

<div>
  <Loader v-if="loading"/>
  <div v-else-if="record">
    <div class="breadcrumb-wrap">
      <router-link to="/history" class="breadcrumb">{{'Menu_History' | localize}}</router-link>
      <a @click.prevent class="breadcrumb">
        {{ recType }}
      </a>
    </div>
    <div class="row">
      <div class="col s12 m6">
        <div class="card" :class="{
          'red': record.type === 'outcome',
          'green': record.type === 'income'
        }">
          <div class="card-content white-text">
            <p>{{'Message_Description' | localize}}: {{ record.description }}</p>             
            <p>{{'Message_Sum' | localize}}: {{ record.amount | currency }}</p>
            <p>{{'HistoryTable_Category' | localize}}: {{ record.categoryName }}</p>
            <small>{{ record.date | date('datetime')}}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
  <p class="center" v-else> {{'Message_RecordWithId' | localize}}={{$route.params.id}} {{'Message_NotFound' | localize}}</p>
</div>

</template>

<script>
import localizeFilter from '@/filters/localize.filter' // импортируем фильтр

export default {
  name: 'detail',
  metaInfo() {
    return {
      title: this.$title('Detail')
    }
  },

  data() {
    return {
      loading: true,
      record: null,
    }
  },
  
  async mounted() {
    const id = this.$route.params.id
    const record = await this.$store.dispatch('fetchRecordById', id)
    const category = await this.$store.dispatch('fetchCategoryById', record.categoryId)

    this.record = {
      ...record,
      categoryName: category.title
    }

    this.loading = false
  },
  computed: {
    recType () {
      if (this.record.type === 'income') {
        return localizeFilter('HistoryTable_Income')
      }
      return localizeFilter('HistoryTable_Outcome')
    },
  },

}
</script>