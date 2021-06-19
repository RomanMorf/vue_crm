<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Сумма</th>
          <th>Дата</th>
          <th>Категория</th>
          <th>Тип</th>
          <th>Открыть</th>
          <th>Изменить</th>
          <th>Удалить</th>
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
              v-tooltip='"Просмотреть запись"'
              >
              <i class="material-icons">open_in_new</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="$router.push('/edit/' + record.id)"
              v-tooltip='"Редактировать запись"'
              >
              <i class="material-icons">edit</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="removeRecord(record.id, index)"
              v-tooltip='"Удалить запись"'
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
    removeRecord(recordId, index){
      this.$emit('indexForDelete', index)
      this.$store.dispatch('deleteRecord', recordId)
    }
  }
}
</script>