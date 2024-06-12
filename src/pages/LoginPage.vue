<template>
  <div class="login-container">
    <h1>로그인</h1>
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
  background-color: #0056b3;
}
</style>
