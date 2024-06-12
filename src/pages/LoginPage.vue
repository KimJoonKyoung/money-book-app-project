<template>
  <div class="login-container">
    <h1>로그인</h1>
    <!-- 로그인 폼을 작성하고 로그인 버튼을 추가합니다. -->
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
const username = ref('');
const password = ref('');
const router = useRouter();
const login = () => {
  const enteredUsername = username.value;
  const enteredPassword = password.value;
  if (enteredUsername && enteredPassword) {
    // 사용자 아이디를 프로필 사이드바로 전달하여 로그인 후 화면으로 이동합니다.
    router.push({
      path: '/home',
      query: { username: enteredUsername },
    });
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
  z-index: 9999; /* 다른 요소 위에 표시되도록 설정 */
}
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
input {
  margin: 5px 0; /* 상하 여백을 조정합니다. */
  padding: 5px;
}
button {
  margin-top: 10px; /* 버튼 위에 여백을 추가합니다. */
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
