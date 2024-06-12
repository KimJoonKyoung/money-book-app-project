<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
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
    <div class="fixed-button-container-bottom">
      <router-link to="/edit">
        <button class="add-button">
          <i class="fa-solid fa-pencil"></i>
        </button>
      </router-link>
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
  height: 100vh;
  background-color: #ffcc00; /* KB 국민은행의 전통 노란색 */
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 중앙 정렬 */
  position: fixed;
  right: 0;
  /* top: 0; */
  box-sizing: border-box;
  /* overflow-y: auto; */
  z-index: 1;
}

.profile {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.fixed-button-container-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
}

.add-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}
</style>
