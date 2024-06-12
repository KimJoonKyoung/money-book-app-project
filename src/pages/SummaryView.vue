<template>
  <div class="summary-container">
    <!-- Date Range Selector -->
    <div class="date-range-selector">
      <div class="date-input">
        <label for="start-date">시작 날짜:</label>
        <input
          type="date"
          id="start-date"
          v-model="startDate"
          @change="fetchTransactions"
        />
      </div>
      <div class="date-input">
        <label for="end-date">종료 날짜:</label>
        <input
          type="date"
          id="end-date"
          v-model="endDate"
          @change="fetchTransactions"
        />
      </div>
    </div>
    <!-- Summary Title -->
    <h1 class="summary-title">Summary View</h1>
    <!-- Total Income and Expense section -->
    <div class="totals-container">
      <div class="summary-section total-income-section">
        <h3>총 수입</h3>
        <div class="total-amount">
          {{ totalIncome }}
        </div>
      </div>
      <div class="summary-section total-expense-section">
        <h3>총 지출</h3>
        <div class="total-amount">
          {{ totalExpense }}
        </div>
      </div>
    </div>
    <!-- Income Table -->
    <h3 class="table-title">수입 항목</h3>
    <table class="summary-table income-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>내역</th>
          <th>금액</th>
          <th>분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in incomeItems" :key="'income-' + index">
          <td>{{ item.date }}</td>
          <td>{{ item.memo }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
        </tr>
      </tbody>
    </table>
    <!-- Expense Table -->
    <h3 class="table-title">지출 항목</h3>
    <table class="summary-table expense-table">
      <thead>
        <tr>
          <th>날짜</th>
          <th>내역</th>
          <th>금액</th>
          <th>분류</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in expenseItems" :key="'expense-' + index">
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
      startDate: '', // 시작 날짜
      endDate: '', // 종료 날짜
      transactions: [], // 모든 거래 항목
      incomeItems: [], // 수입 항목
      expenseItems: [], // 지출 항목
    };
  },
  created() {
    this.setDefaultDates(); // 기본 날짜 설정
    this.fetchTransactions(); // 거래 내역 불러오기
  },
  computed: {
    totalIncome() {
      // 총 수입 계산
      return this.incomeItems.reduce((total, item) => total + item.amount, 0);
    },
    totalExpense() {
      // 총 지출 계산
      return this.expenseItems.reduce((total, item) => total + item.amount, 0);
    },
  },
  methods: {
    setDefaultDates() {
      // 기본 시작 및 종료 날짜 설정 (현재 달)
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      this.startDate = firstDayOfMonth.toISOString().split('T')[0];
      this.endDate = lastDayOfMonth.toISOString().split('T')[0];
    },
    fetchTransactions() {
      // 거래 내역 불러오기
      axios
        .get('http://localhost:3000/budget')
        .then((response) => {
          this.transactions = response.data;
          this.updateFilteredItems();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    updateFilteredItems() {
      // 날짜 범위 및 항목 타입에 따라 거래 항목 필터링 및 정렬
      this.incomeItems = this.transactions
        .filter(
          (item) =>
            item.type === 'income' &&
            item.date >= this.startDate &&
            item.date <= this.endDate
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      this.expenseItems = this.transactions
        .filter(
          (item) =>
            item.type === 'expense' &&
            item.date >= this.startDate &&
            item.date <= this.endDate
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
  },
};
</script>

<style>
.summary-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.date-range-selector {
  margin-bottom: 20px;
}
.summary-title {
  text-align: center;
  color: #ffcb05; /* 국민은행 노랑 */
  font-size: 24px;
}
.totals-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}
.summary-section {
  text-align: center;
  border: 1px solid #ddd;
  padding: 10px;
  flex: 1;
}
.total-income-section {
  background-color: #ffcccc;
}
.total-expense-section {
  background-color: #ccccff;
}
.total-amount {
  font-size: 24px;
}
.table-title {
  margin-top: 30px;
  margin-bottom: 10px;
  text-align: center;
  color: #ffcb05; /* 국민은행 노랑 */
  font-size: 20px;
}
.summary-table {
  width: 80%;
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
