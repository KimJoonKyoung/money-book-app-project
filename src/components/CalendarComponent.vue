<template>
  <div class="calendar">
    <h1>June 2024</h1>
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
        <tr v-for="week in weeks">
          <td v-for="day in week" class="day-cell">{{ day }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weeks: [
        ['', '', '', '', '', '', 1],
        [2, 3, 4, 5, 6, 7, 8],
        [9, 10, 11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20, 21, 22],
        [23, 24, 25, 26, 27, 28, 29],
        [30, '', '', '', '', '', ''],
      ],
    };
  },
};
</script>

<style scoped>
.calendar {
  text-align: center;
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
}

th {
  background-color: #f2f2f2;
}

.day-cell {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
