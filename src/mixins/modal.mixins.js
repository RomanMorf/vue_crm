const modalMixin = {
  data() {
    return {
      isShowModal: false,
      count: 0, 
      isShowModalAnimate: false,
    };
  },
  methods: {
    showModal() {
      this.isShowModal = true;
      setTimeout(()=> {
        this.isShowModalAnimate = true
      }, 50)
    },
    closeModal() {
      this.isShowModal = false;
      this.count = 0
      this.isShowModalAnimate = false
    },
    clickAwayModal() {
      if (this.isShowModal) {
        this.count++
      }
      if (this.count >= 2) {
        this.closeModal()
        this.count = 0
        this.isShowModalAnimate = false
      }
    },
  },
};

export default modalMixin;
