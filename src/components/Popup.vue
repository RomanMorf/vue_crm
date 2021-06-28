<template>
  <div class="popup">
      <div class="popup_wrapper">
        <div class="popup_body">
          text
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'popup',
}
</script>

<style scoped>
  .popup {
    position: relative;
  }
  .popup_wrapper {
    position: fixed;
      top: 10px;
      left: 10px;
      width: 100px;
      height: 100px;
      background-color: rgba(100, 100, 100, 0.5);
  }
</style> 