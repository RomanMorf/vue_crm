<template>
  <div>
    <nav class="navbar orange lighten-1">
      <div class="nav-wrapper">
        <div class="navbar-left">
          <a href="#" @click.prevent="$emit('click')" v-show="!open"> 
            <i class="material-icons black-text">dehaze</i>
          </a>          
          <a href="#" v-show="open"> 
            <i class="material-icons black-text">close</i>
          </a>

          <span class="black-text">{{ date | date('datetime') }}</span>  
          <!-- применен фильтр для вывода даты и времени 
          datetime - выводит и дату и время.
          date - только дата
          time - только время -->
        </div>

        <ul class="right ">
          <li>
            <a
                class="dropdown-trigger black-text"
                href="#"
                data-target="dropdown"
                ref='dropdown'
            >
              <span class="hide-on-small-and-down">{{ name }}</span>
              <i class="material-icons right hide-on-small-and-down">arrow_drop_down</i>
              <i class="material-icons right hide-on-med-and-up">account_circle</i>
            </a>

            <ul id='dropdown' class='dropdown-content dropdown-content2'>
              <li>
                <router-link to="/profile" class="black-text">
                  <i class="material-icons">account_circle</i>{{'Menu_Profile' | localize}}
                </router-link>
              </li>
              <li class="divider" tabindex="-1"></li>
              <li>
                <a href="#" class="black-text" @click.prevent='logout'>
                  <i class="material-icons">assignment_return</i>{{'Menu_Loguot' | localize}}
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
  props: ['open'],
  data: () => ({
    date: new Date,
    dropdown: null,
    interval: null,
  }),

  methods: {
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    awayNavBar() {
      console.log('away nav bar');
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