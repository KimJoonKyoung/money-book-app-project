<template>
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
          class="profile-option"
        />
      </div>
    </div>
    <div class="text-display">
      <p>수입: {{ formattedTotalIncome }}</p>
      <p>지출: {{ formattedTotalExpense }}</p>
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
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores';
import axios from 'axios';

const userStore = useUserStore();
const defaultProfile = '/assets/coli.png';
const profileCandidates = [
  '/assets/argar.png',
  '/assets/runa.png',
  '/assets/coli.png',
  '/assets/bibi.png',
  '/assets/ramu.png',
];

const selectedProfile = ref(
  localStorage.getItem('selectedProfile') || defaultProfile
);
const showImageOptions = ref(false);
const totalIncome = ref(parseInt(localStorage.getItem('totalIncome')) || 0);
const totalExpense = ref(parseInt(localStorage.getItem('totalExpense')) || 0);

onMounted(async () => {
  await userStore.fetchUsername();
  fetchData();
});

const fetchData = async () => {
  try {
    const response = await axios.get('./db.json');
    const data = response.data.budget || [];

    totalIncome.value = calculateTotal(data, 'income');
    totalExpense.value = calculateTotal(data, 'expense');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const calculateTotal = (data, type) => {
  return data
    .filter((item) => item.type === type)
    .reduce((acc, item) => acc + item.amount, 0);
};

const changeProfileImage = (image) => {
  selectedProfile.value = image;
  localStorage.setItem('selectedProfile', image);
  showImageOptions.value = false;
};

const openProfileImageOptions = () => {
  showImageOptions.value = !showImageOptions.value;
};

const formattedTotalIncome = computed(
  () => totalIncome.value.toLocaleString() + ' 원'
);
const formattedTotalExpense = computed(
  () => totalExpense.value.toLocaleString() + ' 원'
);
</script>

<style scoped>
.sidebar-right {
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
  border: 2px solid white;
}

.image-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;
}

.profile-option {
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

.text-display {
  text-align: center;
  margin-bottom: 50px;
}
</style>
