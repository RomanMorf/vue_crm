<template>
  
  <div>
    <div class="app-main-layout">

      <Navbar 
        @click="(openBar())"
        :open="isOpen"
      />

      <Sidebar 
        v-model="isOpen"
        :key="locale" 
        v-on-clickaway="awaySideBar"
        @sidebarClick="sidebarClick"
        
      />

      <main class="app-content" :class="{full: !isOpen}">
        <div class="app-page">
          <router-view/>
        </div>
      </main>

      <transition name="bounce2">
        <div v-show="isFixedBtn" class="fixed-action-btn">
          <router-link class="btn-floating btn-large blue" to="/record" v-tooltip='"Menu_Record"'>
            <i class="large material-icons">add</i>
          </router-link>
        </div>
      </transition>

    </div>

  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import Sidebar from '@/components/app/Sidebar'
import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'main-layout',
  components: {
    Sidebar,
    Navbar
  },
  data: () => ({
    isOpen: false,
    else: true,
    isLoading: true,
    isFixedBtn: true
  }),
  methods: {
    openBar() {
      setTimeout(()=> {
        this.isOpen = true
      }, 0)
    },
    awaySideBar(){
      if (this.isOpen) {
        this.isOpen = false
        return
      }
    },
    sidebarClick() {
      setTimeout(()=> {
        this.isOpen = false
      }, 300)
    },
  },
  async mounted() {
    if (!Object.keys(this.$store.getters.info).name) {
      await this.$store.dispatch('fetchInfo')
    }
    this.isLoading = false
  },
  beforeUpdate() {

    switch (this.pagePath) { // управление кнопкой добавления записи
      case 'profile':
        this.isFixedBtn = false
        break;
      case 'edit':
        this.isFixedBtn = false
        break;
    
      default:
        this.isFixedBtn = true
        break;
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    locale () {
      return this.$store.getters.info.locale // в случае, если будут изменения - будет перерисован модуль по этому ключу
    },
    pagePath () {
      return this.$route.name
    }
  },
  directives: {
    onClickaway: onClickaway,
  },
}
</script>


