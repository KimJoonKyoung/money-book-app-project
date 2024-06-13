<template>
  <div class="login-container">
    <!-- 로그인 폰트 별도 지정 -->
    <h1 class="black-han-sans-regular">로그인</h1>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="사용자 이름" />
      <br />
      <input type="password" v-model="password" placeholder="비밀번호" />
      <br />
      <button type="submit">로그인</button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
const username = ref('');
const password = ref('');
const router = useRouter();
const userStore = useUserStore();
const login = async () => {
  const enteredUsername = username.value;
  const enteredPassword = password.value;
  if (enteredUsername && enteredPassword) {
    await userStore.setUsername(enteredUsername);
    router.push('/home');
  } else {
    alert('사용자 이름과 비밀번호를 입력해주세요.');
  }
};
</script>
<style scoped>
/* 폰트 스콥 지정 */
.black-han-sans-regular {
  font-family: 'Black Han Sans', sans-serif;
  font-weight: 400;
  font-style: normal;
}
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffcc00;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; /* Add this line */
  z-index: 9999;
}
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
input {
  margin: 5px 0;
  padding: 5px;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #776264;
  color: #fff;
  transform: scale(1.05); /* 마우스를 올렸을 때 버튼이 약간 커지도록 합니다 */
  border: 2px solid white; /* 호버시 흰색 테두리 추가 */
  border-radius: 10px;
}
</style>
