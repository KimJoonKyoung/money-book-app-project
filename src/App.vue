<template>
  <div class="container">
    <GreetingsSidebar />
    <div class="main-content">
      <router-view />
      <!-- AddList.vue 페이지에 대한 라우팅 -->
      <div class="fixed-button-container">
        <router-view name="fixedButton" />
      </div>
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
}

/* 추가된 스타일 */
.fixed-button-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
