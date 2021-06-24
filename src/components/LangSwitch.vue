<template>
  <div>
    <p>{{'Message_ChooseLang' | localize}}:
      <label class="radio mr_5">
        <input type="radio" 
          v-model="locale"
          checked
          :value='"ru-RU"'
          @click='setNewLocale'
        />
        <span>Русский</span>
      </label>
      <label class="radio mr_5">
        <input type="radio" 
          v-model="locale"
          :value='"en-US"'
          @click='setNewLocale'
        />
        <span>English</span>
      </label>
      <label class="radio mr_5">
        <input type="radio" 
          v-model="locale"
          :value='"ua-UA"'
          @click='setNewLocale'
        />
        <span>Українська</span>
      </label>
    </p>
  </div>
</template>

<script>

export default {
  name: 'locale-switcher',
  data() {
    return {
      locale: this.$store.getters.info.locale || 'ru-RU'
    }
  },
  methods: {
    setNewLocale() {
      const newLocale = {
        locale: this.locale
      }
      this.$store.dispatch('updateInfo', newLocale)
      this.$emit('localeEmit', this.locale)
    },
  },
}
</script>

<style scoped>
  .radio.mr_5 {
    margin-right: 10px;
  }
</style>