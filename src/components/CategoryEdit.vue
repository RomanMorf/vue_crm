<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Btn_Edit' | localize}}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field" >
          <select ref="select" v-model="current" >
            <option
              v-for="c of categories"
              :key="c.id"
              :value="c.id"
              >
              {{c.title}}
            </option>
          </select>
          <label>{{'Message_ChooseCategory' | localize}}</label>
        </div>

        <div class="input-field">
          <input
              id="name_edit"
              type="text"
              v-model="title"
              :class="{invalid: $v.title.$dirty && !$v.title.required}"

          >
          <label for="name_edit">{{'Message_EnterCategoryName' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"

          >
            {{'Message_EnterCategoryName' | localize}}
          </span>
        </div>

        <div class="input-field">
          <input
              id="limit_edit"
              type="number"
              v-model.number="limit"
              :class="{invalid: $v.limit.$dirty && this.limit < $v.limit.minValue}"
          >
          <label for="limit_edit">{{'Message_Limit' | localize}}</label>
          <span 
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >
            {{'Message_MinimalAmount' | localize}} {{ $v.limit.$params.minValue.min }}
          </span>
        </div>

        <button class="btn waves-effect waves-light mr-10 mb-10" type="submit">
          {{'Btn_Edit' | localize}}
          <i class="material-icons right">send</i>
        </button>
        <button class="btn waves-effect waves-light mb-10" @click.prevent="deleteCategory">
          {{'Btn_Delete' | localize}}
          <i class="material-icons right">delete</i>
        </button>
      </form>

      <Modal 
      v-show="isShowModal"
      @close="closeModal"
      @clickAwayModal="clickAwayModal"
      >
      <template v-slot:header>
        <h5 class="center">{{'Message_Attantion' | localize}}</h5>
      </template>

      <template v-slot:content>
        <div class="center">{{'ConfirmDeleteCategory' | localize}} {{title}} ?</div>
      </template>

      <template v-slot:footer>
          <button class="btn waves-effect waves-red mr-10 mb-10" @click="confirmDel()">
            <i class="material-icons right hide-on-small-and-down">delete</i>
            <i class="material-icons hide-on-med-and-up">delete</i>
            <span class="hide-on-small-and-down">{{'Btn_Delete' | localize}}</span>
            </button>
          <button class="btn waves-effect waves-light mb-10" @click="closeModal">
            <i class="material-icons right hide-on-small-and-down">cancel</i>
            <i class="material-icons hide-on-med-and-up">cancel</i>
            <span class="hide-on-small-and-down">{{'Btn_Cancel' | localize}}</span>
            </button>
      </template>
    </Modal>

    </div>
  </div>

</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators' // импортируем валидаторы
import messages from '@/utils/messages'
import Modal from "@/components/app/Modal.vue";
import modalMixin from "@/mixins/modal.mixins.js";

export default {
  props: {
    categories: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      select: null,
      title: '',
      limit: '',
      id: '',
      current: null,
    }
  },
  mixins: [modalMixin],
  methods: {
    async submitHandler() { // редактировать категорию
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        const editetCategory = {
        title: this.title,
        limit: this.limit,
        id: this.id
      }
      await this.$store.dispatch('editCategory', editetCategory)
      this.$message('Категория успешно обновлена')
      this.$emit('update', editetCategory)
      } catch (error) {
        console.log(error);
        throw error
      }
    },
    async categoryDelete() { // удалить категорию
      try {
        const categoryForDelete = {
        id: this.id
        }
        await this.$store.dispatch('deleteCategory', categoryForDelete)

        this.$message('Категория была удалена')
        this.$emit('deleteCat', categoryForDelete)
        
        setTimeout(() => {
          this.select = window.M.FormSelect.init(this.$refs.select);
        }, 0)

        this.title = ''
        this.limit = ''
        this.id = ''

      } catch (error) {
        if (messages[error.code]) {
          this.$message(messages[error.code])
          throw error
        }
      }

    },
    deleteCategory() {
      this.showModal()
    },
    confirmDel() {
      this.categoryDelete()
      this.closeModal()
    },

  },
  validations: {
    title: {required},
    limit: {minValue: minValue(0)},
  },
  created() { // получаем начальные значения для полей
    const {id, title, limit} = this.categories[0]
    this.id = id
    this.title = title
    this.limit = limit
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
    }, 0)

  },
  mounted() {
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select);
    }, 0)

    if (this.categories.length) {
      this.current = this.categories[0].id
    }
    
    window.M.updateTextFields();

  },
  destroyed() { // очищаем кеш селектора, при переходе на другую тсраницу
    if (this.elect && this.select.destroy) {
      this.select.destroy()
    }
  },
  watch: {  // следим за обновлениями в данном объекте
    current(catId) {
      const {title, limit} = this.categories.find(c => c.id === catId)
      this.title = title
      this.limit = limit
      this.id = catId
    }
  },
  components: {
    Modal
  }
}
</script>

<style scoped>
  .btn.waves-effect.waves-light.mr-10 {
    margin-right: 20px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
</style>