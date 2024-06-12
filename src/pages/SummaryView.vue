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
      <a href="#incomelist" class="summary-section total-income-section">
        <h3>총 수입</h3>
        <div class="total-amount">
          {{ totalIncome.toLocaleString() }}
        </div>
      </a>
      <a href="#expenselist" class="summary-section total-expense-section">
        <h3>총 지출</h3>
        <div class="total-amount">
          {{ totalExpense.toLocaleString() }}
        </div>
      </a>
    </div>
    <!-- Income Table -->
    <div id="incomelist" class="table-container">
      <h3 class="table-title">수입 항목</h3>
      <table
        class="summary-table income-table"
        v-if="paginatedIncomeItems.length > 0"
      >
        <thead>
          <tr>
            <th>날짜</th>
            <th>내역</th>
            <th>금액</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedIncomeItems"
            :key="'income-' + index"
          >
            <td>{{ item.date }}</td>
            <td>{{ item.memo }}</td>
            <td>{{ item.amount.toLocaleString() }}</td>
            <td>{{ item.category }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <!-- 처음 페이지로 이동하는 버튼 -->
        <button
          @click="goToFirstIncomePage"
          :disabled="incomecurrentPage === 1"
        >
          <<
        </button>
        <!-- 이전 페이지로 이동하는 버튼 -->
        <button @click="prevIncomePage" :disabled="incomecurrentPage === 1">
          <
        </button>
        <span v-for="pageNumber in incomeVisiblePageNumbers" :key="pageNumber">
          <button
            @click="goToIncomePage(pageNumber)"
            :class="{ active: incomecurrentPage === pageNumber }"
            class="page-number"
          >
            {{ pageNumber }}
          </button>
        </span>
        <!-- 다음 페이지로 이동하는 버튼 -->
        <button
          @click="nextIncomePage"
          :disabled="incomecurrentPage === incomeTotalPages"
        >
          >
        </button>
        <!-- 마지막 페이지로 이동하는 버튼 -->
        <button
          @click="goToLastIncomePage"
          :disabled="incomecurrentPage === incomeTotalPages"
        >
          >>
        </button>
      </div>
    </div>
    <!-- Expense Table -->
    <div id="expenselist" class="table-container">
      <h3 class="table-title">지출 항목</h3>
      <table
        class="summary-table expense-table"
        v-if="paginatedExpenseItems.length > 0"
      >
        <thead>
          <tr>
            <th>날짜</th>
            <th>내역</th>
            <th>금액</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedExpenseItems"
            :key="'expense-' + index"
          >
            <td>{{ item.date }}</td>
            <td>{{ item.memo }}</td>
            <td>{{ item.amount.toLocaleString() }}</td>
            <td>{{ item.category }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <!-- 처음 페이지로 이동하는 버튼 -->
        <button
          @click="goToFirstExpensePage"
          :disabled="expensecurrentPage === 1"
        >
          <<
        </button>
        <!-- 이전 페이지로 이동하는 버튼 -->
        <button @click="prevExpensePage" :disabled="expensecurrentPage === 1">
          <
        </button>
        <span v-for="pageNumber in expenseVisiblePageNumbers" :key="pageNumber">
          <button
            @click="goToExpensePage(pageNumber)"
            :class="{ active: expensecurrentPage === pageNumber }"
            class="page-number"
          >
            {{ pageNumber }}
          </button>
        </span>
        <!-- 다음 페이지로 이동하는 버튼 -->
        <button
          @click="nextExpensePage"
          :disabled="expensecurrentPage === expenseTotalPages"
        >
          >
        </button>
        <!-- 마지막 페이지로 이동하는 버튼 -->
        <button
          @click="goToLastExpensePage"
          :disabled="expensecurrentPage === expenseTotalPages"
        >
          >>
        </button>
      </div>
    </div>
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
      incomecurrentPage: 1, // 수입 페이지 번호
      expensecurrentPage: 1, // 지출 페이지 번호
      itemsPerPage: 10, // 페이지당 항목 수
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
    incomeTotalPages() {
      // 수입 페이지 수 계산
      return Math.ceil(this.incomeItems.length / this.itemsPerPage);
    },
    expenseTotalPages() {
      // 지출 페이지 수 계산
      return Math.ceil(this.expenseItems.length / this.itemsPerPage);
    },
    incomeVisiblePageNumbers() {
      // 수입 페이지의 표시되는 페이지 번호 목록 계산
      return this.calculateVisiblePageNumbers(
        this.incomecurrentPage,
        this.incomeTotalPages
      );
    },
    expenseVisiblePageNumbers() {
      // 지출 페이지의 표시되는 페이지 번호 목록 계산
      return this.calculateVisiblePageNumbers(
        this.expensecurrentPage,
        this.expenseTotalPages
      );
    },
    paginatedIncomeItems() {
      // 현재 수입 페이지에 해당하는 항목 반환
      const startIndex = (this.incomecurrentPage - 1) * this.itemsPerPage;
      return this.incomeItems.slice(startIndex, startIndex + this.itemsPerPage);
    },
    paginatedExpenseItems() {
      // 현재 지출 페이지에 해당하는 항목 반환
      const startIndex = (this.expensecurrentPage - 1) * this.itemsPerPage;
      return this.expenseItems.slice(
        startIndex,
        startIndex + this.itemsPerPage
      );
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
    prevIncomePage() {
      // 이전 수입 페이지로 이동
      if (this.incomecurrentPage > 1) {
        this.incomecurrentPage--;
      }
    },
    nextIncomePage() {
      // 다음 수입 페이지로 이동
      if (this.incomecurrentPage < this.incomeTotalPages) {
        this.incomecurrentPage++;
      }
    },
    goToIncomePage(pageNumber) {
      // 지정된 수입 페이지로 이동
      if (pageNumber >= 1 && pageNumber <= this.incomeTotalPages) {
        this.incomecurrentPage = pageNumber;
      }
    },
    goToFirstIncomePage() {
      // 첫 번째 수입 페이지로 이동
      this.incomecurrentPage = 1;
    },
    goToLastIncomePage() {
      // 마지막 수입 페이지로 이동
      this.incomecurrentPage = this.incomeTotalPages;
    },
    prevExpensePage() {
      // 이전 지출 페이지로 이동
      if (this.expensecurrentPage > 1) {
        this.expensecurrentPage--;
      }
    },
    nextExpensePage() {
      // 다음 지출 페이지로 이동
      if (this.expensecurrentPage < this.expenseTotalPages) {
        this.expensecurrentPage++;
      }
    },
    goToExpensePage(pageNumber) {
      // 지정된 지출 페이지로 이동
      if (pageNumber >= 1 && pageNumber <= this.expenseTotalPages) {
        this.expensecurrentPage = pageNumber;
      }
    },
    goToFirstExpensePage() {
      // 첫 번째 지출 페이지로 이동
      this.expensecurrentPage = 1;
    },
    goToLastExpensePage() {
      // 마지막 지출 페이지로 이동
      this.expensecurrentPage = this.expenseTotalPages;
    },
    calculateVisiblePageNumbers(currentPage, totalPages) {
      // 표시되는 페이지 번호 목록 계산
      const maxVisiblePages = 5;
      const totalVisiblePages = Math.min(totalPages, maxVisiblePages);
      const firstVisiblePage = Math.max(
        currentPage - Math.floor(totalVisiblePages / 2),
        1
      );
      const lastVisiblePage = Math.min(
        firstVisiblePage + totalVisiblePages - 1,
        totalPages
      );
      const visiblePages = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        visiblePages.push(i);
      }
      return visiblePages;
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
  display: flex;
  gap: 10px; /* 요소들 사이에 간격 추가 */
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
  text-decoration: none; /* 추가: 앵커 태그의 기본 스타일 제거 */
  color: inherit; /* 추가: 텍스트 색상 상속 */
}
.total-income-section {
  background-color: blue;
  color: #ddd;
}
.total-expense-section {
  background-color: crimson;
  color: #ddd;
}
.total-amount {
  font-size: 24px;
}
.table-title {
  margin-top: 30px;
  margin-bottom: 10px;
  text-align: center;
  color: #f2a900; /* 국민은행 노랑 */
  font-size: 20px;
}
.summary-table {
  width: 100%; /* 수정: 테이블이 부모 요소의 100% 너비를 차지하도록 설정 */
  max-width: 800px; /* 추가: 테이블의 최대 너비를 설정하여 너무 넓어지지 않도록 함 */
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
.table-container {
  width: 100%; /* 추가: 테이블 컨테이너가 부모 요소의 100% 너비를 차지하도록 설정 */
  max-width: 800px; /* 추가: 테이블 컨테이너의 최대 너비를 설정하여 너무 넓어지지 않도록 함 */
}
a {
  text-decoration: none;
  color: inherit;
  display: block; /* 추가: 앵커 태그가 블록 요소로 처리되도록 */
}

.pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}
.pagination button {
  margin: 0 5px;
}
.page-number.active {
  background-color: #007bff; /* 현재 페이지 배경색 */
  color: #ffffff; /* 현재 페이지 글자색 */
  border-color: #007bff; /* 현재 페이지 테두리 */
}

.date-input {
  display: flex;
  flex-direction: column;
}
</style>
