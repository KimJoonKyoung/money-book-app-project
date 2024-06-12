<template>
  <div class="calendar">
    <div class="header">
      <h1>{{ months[selectedMonth] }} {{ selectedYear }}</h1>
    </div>
    <div class="controls">
      <select v-model="selectedYear" @change="updateCalendar">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
      <select v-model="selectedMonth" @change="updateCalendar">
        <option v-for="(month, index) in months" :key="index" :value="index">
          {{ month }}
        </option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <td
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            class="day-cell"
            @click="selectDay(weekIndex, dayIndex)"
          >
            <div class="day-number">{{ day }}</div>
            <!-- 해당 날짜에 대한 수입과 지출 데이터 표시 -->
            <div
              v-if="day && budget.length > 0"
              class="income"
              v-html="getIncome(day)"
            ></div>
            <div
              v-if="day && budget.length > 0"
              class="expenses"
              v-html="getExpense(day)"
            ></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedYear: 2024,
      selectedMonth: 5, // June (0-indexed)
      weeks: [],
      years: Array.from(
        { length: 100 },
        (_, i) => new Date().getFullYear() - 50 + i
      ),
      months: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
      selectedDay: null,
      budget: [],
    };
  },
  mounted() {
    this.updateCalendar();
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('/db.json'); // 실제 경로를 확인하세요.
        this.budget = response.data.budget || []; // 데이터가 없을 때 빈 배열 할당
        console.log('Fetched budget data:', this.budget); // 데이터 확인
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    getIncome(day) {
      const dateStr = `${this.selectedYear}-${String(
        this.selectedMonth + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const income = this.budget
        .filter((item) => item.date === dateStr && item.type === 'income')
        .reduce((sum, item) => sum + item.amount, 0);
      if (income > 0) {
        return `+ ${income.toLocaleString()}`;
      } else {
        return '';
      }
    },
    getExpense(day) {
      const dateStr = `${this.selectedYear}-${String(
        this.selectedMonth + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const expense = this.budget
        .filter((item) => item.date === dateStr && item.type === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);
      if (expense > 0) {
        return `- ${expense.toLocaleString()}`;
      } else {
        return '';
      }
    },
    selectDay(weekIndex, dayIndex) {
      const selectedDay = this.weeks[weekIndex][dayIndex];
      if (selectedDay) {
        this.selectedDay = { weekIndex, dayIndex, day: selectedDay };
        console.log(`Selected day: ${this.selectedDay.day}`);
      }
    },
    updateCalendar() {
      console.log('Updating calendar...'); // 업데이트 확인용 로그
      const firstDay = new Date(
        this.selectedYear,
        this.selectedMonth,
        1
      ).getDay();
      const daysInMonth = new Date(
        this.selectedYear,
        this.selectedMonth + 1,
        0
      ).getDate();
      let weeks = [];
      let week = Array(firstDay).fill('');
      for (let day = 1; day <= daysInMonth; day++) {
        week.push(day);
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }
      if (week.length > 0) {
        week = [...week, ...Array(7 - week.length).fill('')];
        weeks.push(week);
      }
      this.weeks = weeks;
      console.log('Weeks:', this.weeks); // 주 배열 확인
    },
  },
  watch: {
    selectedYear() {
      this.updateCalendar();
    },
    selectedMonth() {
      this.updateCalendar();
    },
  },
};
</script>
<style scoped>
.calendar {
  text-align: center;
}
.header {
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
select {
  margin: 0 0.5rem;
  padding: 0.5rem;
  font-size: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  width: 14.28%; /* 7개의 열이므로 100%를 7로 나눈 값 */
  height: 100px; /* 칸의 높이를 설정하세요 */
  border: 1px solid #ddd;
  position: relative;
  vertical-align: top; /* 날짜를 칸의 상단에 배치 */
}
th {
  background-color: #f2f2f2;
  width: 14.28%; /* 7개의 열이므로 100%를 7로 나눈 값 */
  height: 30px; /* 칸의 높이를 설정하세요 */
  border: 1px solid #ddd;
  position: relative;
  vertical-align: top; /* 날짜를 칸의 상단에 배치 */
}
.day-cell {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
.day-number {
  position: absolute;
  top: 5px;
  left: 5px;
}
/* 기존 스타일은 생략합니다 */
.income {
  color: blue; /* 수입을 파란색으로 설정 */
  margin-top: 20px;
  font-size: small;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}
.expenses {
  color: red; /* 지출을 빨간색으로 설정 */
  margin-top: 20px;
  font-size: small;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0;
}
</style>
