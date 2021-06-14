<template>
  <div>
    <nav class="navbar orange lighten-1">
      <div class="nav-wrapper">
        <div class="navbar-left">
          <a href="#" @click.prevent="$emit('click')"> 
            <i class="material-icons black-text">dehaze</i>
          </a>
          <span class="black-text">{{ date | date('datetime') }}</span>  
          <!-- применен фильтр для вывода даты и времени 
          datetime - выводит и дату и время.
          date - только дата
          time - только время -->
        </div>

        <ul class="right hide-on-small-and-down">
          <li>
            <a
                class="dropdown-trigger black-text"
                href="#"
                data-target="dropdown"
                ref='dropdown'
            >
              {{ name }}
              <i class="material-icons right">arrow_drop_down</i>
            </a>

            <ul id='dropdown' class='dropdown-content'>
              <li>
                <router-link to="/profile" class="black-text">
                  <i class="material-icons">account_circle</i>Профиль
                </router-link>
              </li>
              <li class="divider" tabindex="-1"></li>
              <li>
                <a href="#" class="black-text" @click.prevent='logout'>
                  <i class="material-icons">assignment_return</i>Выйти
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data: () => ({
    date: new Date,
    dropdown: null,
    interval: null,
  }),

  methods: {

    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/login?message=logout');
    },
  },

  computed: {
    name () {
      return this.$store.getters.info.name
    }
  },

  mounted() { //срабатывает только после создания ДОМ дерева
    this.interval = setInterval( () => {
      this.date = new Date;
    }, 1000)

    this.dropdown = window.M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: true,
    })
  },

  beforeDestroy() { // срабатывает, когда компонент закрывается (уничтожается)
    clearInterval(this.interval); //очистить интервал таймера

    if (this.dropdown && this.dropdown.destroy) { // проверка, загрузился ли сам модуль со своими методами, чтобы небыло ошибок
      this.dropdown.destroy // вызов метода удаления 
    }
  },
}
</script>