<template>
  <div class="calendar">
    <div class="header">
      <h1>{{ selectedYear }}년 {{ months[selectedMonth] }}</h1>
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
          <th>일</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
          <th>목</th>
          <th>금</th>
          <th>토</th>
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
              v-if="day && getIncome(day)"
              class="income"
              v-html="getIncome(day)"
            ></div>
            <div
              v-if="day && getExpense(day)"
              class="expenses"
              v-html="getExpense(day)"
            ></div>
            <div
              v-if="
                day && !getIncome(day) && !getExpense(day) && isPastDate(day)
              "
              class="circle"
            >
              <i class="fa-solid fa-thumbs-up"></i>&nbsp;성공
            </div>
            <!-- 여기에 추가 -->
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
      today: new Date(), // 현재 날짜
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
      if (selectedDay && this.isPastDate(selectedDay)) {
        this.selectedDay = { weekIndex, dayIndex, day: selectedDay };
        console.log(`Selected day: ${this.selectedDay.day}`);
      }
    },
    isPastDate(day) {
      const date = new Date(this.selectedYear, this.selectedMonth, day);
      return date <= this.today; // 오늘 날짜 이후의 날짜인지 확인
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
td {
  width: 14.28%; /* 7개의 열이므로 100%를 7로 나눈 값 */
  height: 100px; /* 칸의 높이를 설정하세요 */
  border: 1px solid #ddd;
  position: relative;
  vertical-align: top;
}
th {
  background-color: #f2f2f2;
  width: 14.28%; /* 7개의 열이므로 100%를 7로 나눈 값 */
  height: 30px; /* 칸의 높이를 설정하세요 */
  border: 1px solid #ddd;
  position: relative;
  vertical-align: top;
}
.day-cell {
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  padding-top: 5px;
  box-sizing: border-box;
}
.day-number {
  position: absolute;
  top: 5px;
  left: 5px;
}
.income,
.expenses {
  font-size: small;
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
}
.income {
  color: blue;
  bottom: 35px; /* 지출 요소의 높이 + 간격을 고려하여 위치 지정 */
}
.expenses {
  color: red;
  bottom: 5px;
}
.circle {
  position: absolute;
  top: 5px;
  right: 10px; /* 오른쪽으로 떨어진 거리 조정 */
  font-size: small;
  background-color: rgb(255, 204, 0); /* 배경색 불투명도 50% */
  z-index: -1; /* 맨 뒤로 보내기 */
  padding: 3px 8px; /* 내부 여백 조정 */
  border-radius: 5px; /* 둥근 모서리 적용 */
}
</style>
