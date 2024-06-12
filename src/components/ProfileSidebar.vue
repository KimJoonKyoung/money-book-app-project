<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
  <div class="sidebar-right">
    <div class="profile">
      <img
        :src="selectedProfile"
        alt="Profile Picture"
        class="profile-pic"
        @click="openProfileImageOptions"
      />
      <h2>{{ userStore.username }}</h2>
      <h3 class="sub-text">프로필을 누르면<br />캐릭터를 바꿀 수 있어요!</h3>
      <div v-if="showImageOptions || !selectedProfile" class="image-options">
        <img
          v-for="(image, index) in profileCandidates"
          :src="image"
          :key="index"
          :alt="'Profile Image ' + (index + 1)"
          @click="changeProfileImage(image)"
        />
      </div>
    </div>
    <div class="fixed-button-container-bottom">
      <router-link to="/edit">
        <button class="add-button">
          <i class="fa-solid fa-pencil"></i>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores';
const userStore = useUserStore();
const defaultProfile = '/assets/coli.png'; // 기본 프로필 이미지
const profileCandidates = [
  // 프로필 후보 이미지
  '/assets/argar.png',
  '/assets/runa.png',
  '/assets/coli.png',
  '/assets/bibi.png',
  '/assets/ramu.png',
];
const selectedProfile = ref(defaultProfile); // 선택된 프로필 이미지
const showImageOptions = ref(false); // 이미지 선택 옵션 보여주기 여부
// 프로필 이미지 변경 함수
const changeProfileImage = (image) => {
  selectedProfile.value = image;
  showImageOptions.value = false;
};
// 프로필 이미지 선택 옵션 열기/닫기 함수
const openProfileImageOptions = () => {
  showImageOptions.value = !showImageOptions.value;
};
onMounted(async () => {
  await userStore.fetchUsername();
});
</script>

<style scoped>
.sidebar-right {
  width: 200px;
  height: 100vh;
  background-color: #ffcc00; /* KB 국민은행의 전통 노란색 */
  color: black;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* 중앙 정렬 */
  position: fixed;
  right: 0;

  box-sizing: border-box;

  z-index: 1;
}

.profile {
  text-align: center;
  margin-top: auto;
  margin-bottom: auto;
}

.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  cursor: pointer;
  border: 2px solid white; /* 흰색 테두리 추가 */
}
.image-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}
.image-options img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
}
.fixed-button-container-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
}

.add-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}
.sub-text {
  font-size: 10px;
  color: gray;
}
</style>
