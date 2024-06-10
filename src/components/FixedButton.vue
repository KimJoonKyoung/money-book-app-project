<template>
  <div class="fixed-button-container">
    <button @click="saveAccount">저장</button>
    <button @click="cancel">취소</button>
  </div>
</template>

<script>
export default {
  methods: {
    saveAccount() {
      // AddList.vue의 saveAccount 함수 호출
      this.$parent.saveAccount();
    },
    cancel() {
      // AddList.vue의 cancel 함수 호출
      this.$parent.cancel();
    },
  },
};
</script>

<style scoped>
/* 스타일 */
</style>
