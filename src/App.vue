<template>
  <div class="container">
    <GreetingsSidebar />
    <div class="main-content">
      <router-view />
      <!-- AddList.vue 페이지에 대한 라우팅 -->
    </div>
    <ProfileSidebar />
    <div class="fixed-button-container-bottom">
      <router-link to="/edit">
        <button class="add-button">항목 추가</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import GreetingsSidebar from './components/GreetingsSidebar.vue';
import ProfileSidebar from './components/ProfileSidebar.vue';
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}

/* 추가된 스타일 */
.fixed-button-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.fixed-button-container-bottom {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100; /* 다른 요소 위에 배치하기 위해 z-index 추가 */
}

.add-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}
</style>
