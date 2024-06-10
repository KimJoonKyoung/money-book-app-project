<template>
  <div>
    <h1>Home View</h1>
    <div class="dropdown">
      <label for="year">Select Year:</label>
      <select v-model="selectedYear" id="year" class="dropdown-select">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <label for="month">Select Month:</label>
      <select v-model="selectedMonth" id="month" class="dropdown-select">
        <option
          v-for="(month, index) in months"
          :key="index"
          :value="index + 1"
        >
          {{ month }}
        </option>
      </select>
    </div>
    <!-- CalendarComponent를 먼저 import하여 사용 -->
    <CalendarComponent :year="selectedYear" :month="selectedMonth" />
  </div>
</template>

<script>
// CalendarComponent를 먼저 import
import CalendarComponent from '../components/CalendarComponent.vue';

export default {
  components: {
    CalendarComponent,
  },
  data() {
    return {
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      years: [],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };
  },
  mounted() {
    // 미래의 10년까지의 년도를 배열에 추가
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear + i);
    }
  },
};
</script>

<style scoped>
/* 필요한 스타일을 추가하세요 */
</style>
