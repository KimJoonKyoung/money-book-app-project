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
  overflow: auto; /* 메인 콘텐츠가 넘칠 경우 스크롤 */
}
</style>
