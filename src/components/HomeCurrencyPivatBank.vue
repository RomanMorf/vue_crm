<template>
  <div class="col s25 m6 l8">
    <div class="card orange darken-3">
      <div class="card-content white-text">
        <div class="card-header">
          <span class="card-title">Курс валют</span>
        </div>
        <table>
          <thead>
          <tr>
            <th>Валюта</th>
            <th>Покупка</th>
            <th>Продажа</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(rate, index) in rates" :key="index">
            <td>{{ rate.ccy }}</td>
            <td>{{ rate.buy }}</td>
            <td>{{ rate.sale }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rates'],
}
</script>