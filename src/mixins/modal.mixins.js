const modalMixin = {
  data() {
    return {
      isShowModal: false,
      count: 0,
    };
  },
  methods: {
    showModal() {
      this.isShowModal = true;
    },
    closeModal() {
      this.isShowModal = false;
      this.count = 0
    },
    clickAwayModal() {
      if (this.isShowModal) {
        this.count++
      }
      if (this.count >= 2) {
        this.closeModal()
        this.count = 0
      }
    }
  },
};

export default modalMixin;
