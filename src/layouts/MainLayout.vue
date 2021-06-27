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
        
      />

      <main class="app-content" :class="{full: !isOpen}">
        <div class="app-page">
          <router-view/>
        </div>
      </main>

      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/record" v-tooltip='"Menu_Record"'>
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import Sidebar from '@/components/app/Sidebar'
// import messages from '@/utils/messages'
import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'main-layout',
  components: {
    Sidebar,
    Navbar
  },
  data: () => ({
    isOpen: true,
    else: true,
    isLoading: true,
    // tooltip: 'Создать новую запись',
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

  },
  async mounted() {
    if (!Object.keys(this.$store.getters.info).name) {
      await this.$store.dispatch('fetchInfo')
    }

    this.isLoading = false
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    locale () {
      return this.$store.getters.info.locale // в случае, если будут изменения - будет перерисован модуль по этому ключу
    }
  },
  watch: {
    // error(fbError) {
    //   this.$error(messages[fbError.code] || 'Что-то пошло не так...')
    // }
    // locale () {
    //   console.log('Locale chenge');
    // }
  },
  directives: {
    onClickaway: onClickaway,
  },
}
</script>


