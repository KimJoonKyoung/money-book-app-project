<template>
  <div class="sidebar-left">
    <ul>
      <!-- 각 버튼에 Vue Router의 router-link를 사용하여 경로를 정의 -->
      <li :class="{ active: isActive('/') }">
        <router-link to="/home" class="nav-link"
          ><i class="fa-solid fa-house"></i> 홈</router-link
        >
      </li>
      <br />
      <li :class="{ active: isActive('/list') }">
        <router-link to="/list" class="nav-link"
          ><i class="fa-solid fa-list"></i> 목록</router-link
        >
      </li>
      <br />
      <li :class="{ active: isActive('/summary') }">
        <router-link to="/summary" class="nav-link"
          ><i class="fa-solid fa-clipboard-list"></i> 요약</router-link
        >
      </li>
      <br />
      <li :class="{ active: isActive('/graph') }">
        <router-link to="/graph" class="nav-link"
          ><i class="fa-solid fa-chart-column"></i> 그래프</router-link
        >
      </li>
      <br />
    </ul>
  </div>
</template>
<script>
// Vue Router를 가져와서 사용
import { useRouter } from 'vue-router';
export default {
  setup() {
    // Vue Router를 사용하여 현재 경로를 가져옴
    const router = useRouter();
    // 현재 경로와 버튼의 경로가 일치하는지 확인하는 함수
    const isActive = (path) => {
      return router.currentRoute.value.path === path;
    };
    // 각 버튼을 클릭하면 해당 경로로 이동하는 함수 정의
    const goToHomepage = () => {
      router.push('/');
    };
    const goToList = () => {
      router.push('/list');
    };
    const goToSummary = () => {
      router.push('/summary');
    };
    const goToGraph = () => {
      router.push('/graph');
    };
    return {
      isActive,
      goToHomepage,
      goToList,
      goToSummary,
      goToGraph,
    };
  },
};
</script>
<style scoped>
.sidebar-left {
  width: 200px;
  height: 100vh;
  background-color: #ffcc00;
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  box-sizing: border-box;
  z-index: 2;
}
.sidebar-left ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
  text-align: center;
}
.sidebar-left li {
  margin-bottom: 20px;
  font-size: 1.5rem;
}
.nav-link {
  color: inherit;
  text-decoration: none;
  display: inline-block;
  padding: 10px 16px;
  border-radius: 20px 0 0 20px;
}
.nav-link:hover {
  text-decoration: underline;
}
.active {
  background-color: white;
  border-radius: 20px;
  font-weight: bold;
}
</style>
