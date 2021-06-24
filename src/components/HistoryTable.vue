<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>{{'HistoryTable_Sum' | localize}}</th>
          <th>{{'HistoryTable_Date' | localize}}</th>
          <th>{{'HistoryTable_Category' | localize}}</th>
          <th>{{'HistoryTable_Type' | localize}}</th>
          <th>{{'HistoryTable_Open' | localize}}</th>
          <th>{{'HistoryTable_Edit' | localize}}</th>
          <th>{{'HistoryTable_Delete' | localize}}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(record, index) in records" :key="record.id">
          <td>{{ index + 1 }}</td>
          <td>{{ record.amount | currency('UAH') }}</td>
          <td>{{ record.date | date('date') }}</td>
          <td>{{ record.categoryName }}</td>
          <td>
            <span class="white-text badge" :class="record.typeClass">{{ record.typeText }}</span>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="$router.push('/detail/' + record.id)"
              v-tooltip='"HistoryTable_OpenRecord"'
              >
              <i class="material-icons">open_in_new</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="$router.push('/edit/' + record.id)"
              v-tooltip='"HistoryTable_EditRecord"'
              >
              <i class="material-icons">edit</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="removeRecord(record.id)"
              v-tooltip='"HistoryTable_DeleteRecord"'
              >
              <i class="material-icons">delete</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: 'historyTable',
  props: {
    records: {
      required: true,
      type: Array,
    }
  },

  methods: {
    removeRecord(recordId){
      this.$emit('indexForDelete', recordId)
      this.$store.dispatch('deleteRecord', recordId)
      
      var indexforDel = ''
        this.records.forEach((r, index) => {
          if (r.id === recordId) {
            indexforDel = index
          }
        })
      this.records.splice(indexforDel, 1)
    }
  }
}
</script>