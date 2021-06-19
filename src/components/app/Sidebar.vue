<template>
  <div>
    <ul class="sidenav app-sidenav" :class="{open: value}">
      <router-link
      v-for="(link, index) in links"
      :key="index"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact"
      >
        <a class="waves-effect waves-orange pointer">{{ link.title }}</a>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data: () => ({
    links: [
      {title: 'Счет', url: '/', exact: true}, //исключить "/"
      {title: 'История', url: '/history',},
      {title: 'Новая запись', url: '/record',},
      {title: 'Планирование', url: '/planning',},
      {title: 'Категории', url: '/categories',},
    ]
  })
}
</script>