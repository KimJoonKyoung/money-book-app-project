<template>
  <h1 style="text-align: center">Summary</h1>
  <div class="container">
    <!-- 기존 내용은 그대로 유지 -->
    <!-- 수입 항목 표시 -->
    <table class="summary-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>사용내역</th>
          <th>금액</th>
          <th>분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in incomeItems" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.memo }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 지출 항목 표시 -->
    <table class="summary-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>사용내역</th>
          <th>금액</th>
          <th>분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in expenseItems" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.memo }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
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
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      incomeItems: [],
      expenseItems: [],
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      axios.get('http://localhost:3000/budget').then((response) => {
        this.incomeItems = response.data.filter(
          (item) => item.type === 'income'
        );
        this.expenseItems = response.data.filter(
          (item) => item.type === 'expense'
        );
      });
    },
    // 나머지 메소드들은 그대로 유지
  },
};
</script>
<style>
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.summary-table th,
.summary-table td {
  border: 1px solid #dddddd;
  padding: 8px;
  text-align: center;
}
.summary-table th {
  background-color: #f2f2f2;
}
.summary-table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
