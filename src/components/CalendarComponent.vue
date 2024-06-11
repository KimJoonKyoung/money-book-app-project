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
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
      selectedDay: null,
    };
  },
  mounted() {
    this.updateCalendar();
  },
  methods: {
    selectDay(weekIndex, dayIndex) {
      const selectedDay = this.weeks[weekIndex][dayIndex];
      if (selectedDay) {
        this.selectedDay = { weekIndex, dayIndex, day: selectedDay };
        console.log(`Selected day: ${this.selectedDay.day}`);
      }
    },
    updateCalendar() {
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
</style>
