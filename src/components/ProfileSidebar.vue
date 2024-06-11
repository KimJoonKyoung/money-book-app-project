<template>
  <div class="sidebar-right">
    <div class="profile">
      <img
        src="@/assets/profile.png"
        alt="Profile Picture"
        class="profile-pic"
      />
      <h2>User Name</h2>
      <p>User introduction goes here.</p>
      <!-- <div class="edit-icon" @click="goToEditPage">✏️</div> -->
      <!-- 연필 이모티콘 클릭 이벤트 -->
    </div>
  </div>
</template>

<!-- <script>
export default {
  methods: {
    goToEditPage() {
      this.$router.push('/edit');
    },
  },
};
</script> -->

<style scoped>
.sidebar-right {
  width: 200px;
  background-color: #ffcc00; /* KB 국민은행의 전통 노란색 */
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 중앙 정렬 */
}

.profile {
  text-align: center;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}
</style>
