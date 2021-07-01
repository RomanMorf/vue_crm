<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>{{'HistoryTable_Sum' | localize}}</th>
          <th class="w700-display">{{'HistoryTable_Date' | localize}}</th>
          <th class="w700-display">{{'HistoryTable_Category' | localize}}</th>
          <th>{{'HistoryTable_Type' | localize}}</th>
          <th class="w700-display">{{'HistoryTable_Open' | localize}}</th>
          <th>{{'HistoryTable_Edit' | localize}}</th>
          <th>{{'HistoryTable_Delete' | localize}}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(record, index) in records" :key="record.id">
          <td>{{ index + 1 }}</td>
          <td>{{ record.amount | currency('UAH') }}</td>
          <td class="w700-display">{{ record.date | date('date') }}</td>
          <td class="w700-display">{{ record.categoryName }}</td>
          <td>
            <span class="white-text badge" :class="record.typeClass">{{ record.typeText }}</span>
          </td>
          <td class="w700-display">
            <button 
              class="btn-small btn" 
              @click="$router.push('/detail/' + record.id)"
              >
              <i class="material-icons">open_in_new</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="$router.push('/edit/' + record.id)"
              >
              <i class="material-icons">edit</i>
            </button>
          </td>
          <td>
            <button 
              class="btn-small btn" 
              @click="deleteRecord(record)"
              >
              <i class="material-icons">delete</i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Modal 
      v-show="isShowModal"
      @close="closeModal"
      @clickAwayModal="clickAwayModal"
      >
      <template v-slot:header>
        <transition name="bounce">
          <h5 v-show="isShowModalAnimate" class="center">{{'Message_Attantion' | localize}}</h5>
        </transition>
      </template>

      <template v-slot:content>
        <transition name="bounce">
          <div v-show="isShowModalAnimate" class="center">{{'ConfirmDeleteRecord' | localize}} ? </div>
        </transition>

      </template>

      <template v-slot:footer>

        <transition name="bounce">
          <button v-show="isShowModalAnimate" class="btn waves-effect waves-red mr-10 mb-10" @click="confirmDel()">
            <i class="material-icons right hide-on-small-and-down">delete</i>
            <i class="material-icons hide-on-med-and-up">delete</i>
            <span class="hide-on-small-and-down">{{'Btn_Delete' | localize}}</span>
          </button>
        </transition>


        <transition name="bounce">
          <button v-show="isShowModalAnimate" class="btn waves-effect waves-light mb-10" @click="closeModal">
            <i class="material-icons right hide-on-small-and-down">cancel</i>
            <i class="material-icons hide-on-med-and-up">cancel</i>
            <span class="hide-on-small-and-down">{{'Btn_Cancel' | localize}}</span>
          </button>
        </transition>

      </template>

      <template v-slot:closeBtn></template>

    </Modal>

  </div>
</template>

<script>
import Modal from "@/components/app/Modal.vue";
import modalMixin from "@/mixins/modal.mixins.js";
import { directive as onClickaway } from 'vue-clickaway'

export default {
  name: 'historyTable',
  props: {
    records: {
      required: true,
      type: Array,
    }
  },
  mixins: [modalMixin],
  data() {
    return {
      dataForDelete: null
    }
  },
  methods: {
    deleteRecord(record) {
      this.showModal()
      this.dataForDelete = record
    },
    confirmDel() {
      this.removeRecord(this.dataForDelete)
      this.closeModal()
      this.dataForDelete = null
    },
    removeRecord(record){ // удалить запись
      this.$emit('indexForDelete', record.id)
      this.$store.dispatch('deleteRecord', record.id)
      if (record.type === 'outcome') { // если запись была расход - вернуть сумму на счет
        let newBill = +this.$store.getters.info.bill + +record.amount
        this.$store.dispatch('updateInfo', {bill: newBill})
      } else if (record.type === 'income') { // если запись была доход - отнять сумму от счета
        let newBill = +this.$store.getters.info.bill - +record.amount
        this.$store.dispatch('updateInfo', {bill: newBill})
      }
      
      var indexforDel = ''
        this.records.forEach((r, index) => {
          if (r.id === record.id) {
            indexforDel = index
          }
        })
      this.records.splice(indexforDel, 1)
    },
  },
  components: {
    Modal
  },
  directives: {
    onClickaway: onClickaway,
  },

}
</script>

