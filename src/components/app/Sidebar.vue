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
        <a class="waves-effect waves-orange pointer" @click="(sidebarClick())">
          <i v-if="link.iconName" class="material-icons left" >{{ link.iconName }}</i> 
          {{ link.title }}</a>
      </router-link>
    </ul>
  </div>
</template>

<script>
import localizeFilter from '@/filters/localize.filter' // импортируем фильтр

export default {
  props: ['value'],
  data: () => ({
    links: [
      {title: localizeFilter('Menu_Bill'), url: '/', exact: true, iconName: 'account_balance_wallet',}, //исключить "/"
      {title: localizeFilter('Menu_History'), url: '/history', iconName: 'history',},
      {title: localizeFilter('Menu_Record'), url: '/record', iconName: 'create',},
      {title: localizeFilter('Menu_Planning'), url: '/planning', iconName: 'timeline',},
      {title: localizeFilter('Menu_Categories'), url: '/categories', iconName: 'category',},
    ],
    windowWidth: window.innerWidth,
  }),
  methods: {
    sidebarClick() {
      if (this.windowWidth < 900) {
        this.$emit('sidebarClick')
      }
    },
  },
  beforeUpdate() {
    this.windowWidth = window.innerWidth
  },
}
</script>