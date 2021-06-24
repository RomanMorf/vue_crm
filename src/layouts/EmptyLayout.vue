<template>
  <div class="grey darken-1 empty-layout">
    <router-view/>
  </div>
</template>

<script>
// import messages from '@/utils/messages'

export default {
  // computed: {
  //   error () {
  //     return this.$store.getters.error
  //   },
  //   // locale () {
  //   //   return this.$store.getters.info.locale // в случае, если будут изменения - будет перерисован по этому кобчу модуль
  //   // }

  // },
  // watch: {
  //   // error(fbError) {
  //   //   this.$error(messages[fbError.code] || 'Что-то пошло не так...')
  //   // }
  //   locale () {
  //     console.log('Locale chenge');
  //   }

  // }
}
</script>