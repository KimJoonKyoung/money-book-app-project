<template>
  <div class="loading-container">
    <h1>KB 국민은행 가계부</h1>
    <button @click="goToLogin">로그인</button>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goToLogin = () => {
  router.push('/login');
};
</script>
<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffcc00;
  background-image: url('/image/img3.jpg');
  opacity: 5;
  background-size: cover; /* 배경 이미지를 컨테이너에 맞게 조절합니다 */
  background-position: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  z-index: 9999; /* 다른 요소 위에 표시되도록 설정 */
}
button {
  padding: 10px 200px;
  font-size: 18px;
  background-color: #f2a900;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 48%;
}
button:hover {
  background-color: #776264;
  color: #fff;
  transform: scale(1.05); /* 마우스를 올렸을 때 버튼이 약간 커지도록 합니다 */
  border: 2px solid white; /* 호버시 흰색 테두리 추가 */
  border-radius: 10px;
}
.date-input {
  display: flex;
  flex-direction: column;
}
h1 {
  color: #776264;
  font-weight: bold;
  margin-top: 8%;
}
</style>
