<template>
  <div class="container">
    <div class="date-range">
      <input type="date" v-model="startDate" />
      <span>-</span>
      <input type="date" v-model="endDate" />
      <button @click="filterByDate">기간 확인</button>
    </div>
    <h2 style="text-align: center">가계부</h2>
    <table id="incomeTable">
      <thead>
        <tr>
          <th @click="sortTable('incomeTable', 0)">날짜</th>
          <th @click="sortTable('incomeTable', 1)">사용내역</th>
          <th @click="sortTable('incomeTable', 2)">금액</th>
          <th @click="sortTable('incomeTable', 3)">분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in incomeItems" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
        </tr>
      </tbody>
    </table>
    <table id="expenseTable">
      <thead>
        <tr>
          <th @click="sortTable('expenseTable', 0)">날짜</th>
          <th @click="sortTable('expenseTable', 1)">사용내역</th>
          <th @click="sortTable('expenseTable', 2)">금액</th>
          <th @click="sortTable('expenseTable', 3)">분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in expenseItems" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      incomeItems: [],
      expenseItems: [],
    };
  },
  methods: {
    addIncome() {
      this.addToTable('incomeItems');
    },
    addExpense() {
      this.addToTable('expenseItems');
    },
    addToTable(tableId) {
      // 추가 기능 구현
    },
    editRow(row) {
      // 수정 기능 구현
    },
    saveEdit(button, tableId) {
      // 저장 기능 구현
    },
    filterByDate() {
      // 날짜 필터링 기능 구현
    },
    sortTable(tableId, column) {
      // 테이블 정렬 기능 구현
    },
  },
};
</script>
<style>
/* 스타일 코드는 그대로 사용할 수 있습니다. */
</style>
