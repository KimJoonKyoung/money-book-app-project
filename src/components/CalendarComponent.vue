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
              Challenge Success
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
  width: fit-content; /* 내용에 맞게 넓이 설정 */
  height: fit-content; /* 내용에 맞게 높이 설정 */
  position: absolute;
  color: rgb(101, 153, 22); /* 텍스트 색상 */
  top: 50%; /* 상대적 위치에서 중앙 정렬 */
  left: 50%; /* 상대적 위치에서 중앙 정렬 */
  transform: translate(-50%, -50%); /* 중앙 정렬을 위한 transform */
  display: flex; /* 내부 컨텐츠 정렬을 위한 flex 사용 */
  justify-content: center; /* 내부 컨텐츠 가운데 정렬 */
  align-items: center;
  font-size: small;
  border: 2px solid rgb(101, 153, 22); /* 검정색 테두리 */
  border-radius: 50%;
  padding: 15px 10px;
  /* color: white; */
}
</style>
