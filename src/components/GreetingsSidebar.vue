<template>
  <div class="sidebar-left">
    <ul>
      <!-- 각 버튼에 Vue Router의 router-link를 사용하여 경로를 정의 -->
      <router-link to="/" class="nav-link">Homepage</router-link>
      <br />
      <router-link to="/list" class="nav-link">List</router-link>
      <br />
      <router-link to="/summary" class="nav-link">Summary</router-link>
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

    return {
      // 각 버튼을 클릭하면 해당 경로로 이동하는 함수 정의
      goToHomepage() {
        router.push('/');
      },
      goToList() {
        router.push('/list');
      },
      goToSummary() {
        router.push('/summary');
      },
    };
  },
};
</script>

<style scoped>
.sidebar-left {
  width: 200px;
  background-color: #ffcc00;
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
}

.nav-link:hover {
  text-decoration: underline;
}
</style>
