<template>
  <div class="container">
    <GreetingsSidebar />
    <div class="main-content">
      <router-view />
      <!-- AddList.vue 페이지에 대한 라우팅 -->
    </div>
    <ProfileSidebar />
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
  margin-right: 100px;
  margin-left: 100px;
  box-sizing: border-box; /* 패딩과 보더의 크기를 포함하여 계산 */
  overflow-y: auto;
  overflow-x: hidden;
  position: relative; /* Ensure relative positioning for absolute child */
}

.main-content::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/image/img3.jpg'); /* Specify your background image URL */
  background-size: 75%; /* Adjust to cover the entire area */
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.1; /* Light opacity for watermark effect */
  z-index: -1; /* Ensure it stays behind the content */
}
</style>
