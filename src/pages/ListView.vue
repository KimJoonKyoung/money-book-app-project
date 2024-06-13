<template>
  <div class="container">
    <h1>목록</h1>
    <br />
    <div id="tablefilter">
      <label for="startDateFilter">시작 날짜:</label>&nbsp;
      <input type="date" id="startDateFilter" v-model="startDate" />&nbsp;&nbsp;

      <label for="endDateFilter">종료 날짜:</label>&nbsp;
      <input
        type="date"
        id="endDateFilter"
        v-model="endDate"
      />&nbsp;&nbsp;&nbsp;

      <label for="typeFilter">타입:</label>&nbsp;
      <select id="typeFilter" v-model="selectedType" @change="updateCategories">
        <option value="">전체</option>
        <option v-for="type in types" :value="type.value">
          {{ type.label }}
        </option></select
      >&nbsp;&nbsp;

      <label for="categoryFilter">카테고리:</label>&nbsp;
      <select id="categoryFilter" v-model="selectedCategory">
        <option value="">전체</option>
        <option v-for="category in filteredCategories" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <br />
    <div class="table-wrapper">
      <table class="table-container">
        <thead>
          <tr>
            <th>날짜</th>
            <th>타입</th>
            <th>카테고리</th>
            <th>메모</th>
            <th>금액</th>
            <th>잔액</th>
            <th>동작</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in displayedItems" :key="item.id">
            <td>{{ item.date }}</td>
            <td
              :class="{
                'income-type': item.type === 'income',
                'expense-type': item.type === 'expense',
              }"
            >
              {{ item.type === 'income' ? '수입' : '지출' }}
            </td>
            <td>{{ item.category }}</td>
            <td>{{ item.memo }}</td>
            <td>{{ formatNumber(item.amount) }} 원</td>
            <td>{{ formatNumber(item.balance) }} 원</td>
            <td>
              <div class="button-container">
                <router-link :to="{ name: 'Update', params: { id: item.id } }">
                  <button>편집</button>
                </router-link>
                <button @click="deleteItem(item.id)">삭제</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <br />
    <div class="excel-button">
      <button @click="exportToExcel">엑셀로 내보내기</button>&nbsp;
      <input type="text" v-model="excelFileName" placeholder="파일 이름" />
    </div>
    <br />
    <div class="pagination">
      <!-- 처음 페이지로 이동하는 버튼 -->
      <button @click="goToFirstPage" :disabled="currentPage === 1"><<</button>
      <!-- 이전 페이지로 이동하는 버튼 -->
      <button @click="prevPage" :disabled="currentPage === 1"><</button>
      <!-- 페이지 번호 표시 -->
      <span v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
        <button
          @click="goToPage(pageNumber)"
          :class="{ active: currentPage === pageNumber }"
          class="page-number"
        >
          {{ pageNumber }}
        </button>
      </span>
      <!-- 다음 페이지로 이동하는 버튼 -->
      <button @click="nextPage" :disabled="currentPage === totalPages">
        >
      </button>
      <!-- 마지막 페이지로 이동하는 버튼 -->
      <button @click="goToLastPage" :disabled="currentPage === totalPages">
        >>
      </button>
    </div>
  </div>
  <br />
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      items: [],
      itemsPerPage: 10,
      currentPage: 1,
      selectedDate: '',
      selectedType: '',
      selectedCategory: '',
      startDate: '', // 추가: 시작 날짜
      endDate: '', // 추가: 종료 날짜
      incomeCategories: ['월급', '이자', '용돈', '이월', '기타'],
      expenseCategories: [
        '식비',
        '교통',
        '주거',
        '통신',
        '문화생활',
        '쇼핑',
        '적금',
        '기타',
      ],
      excelFileName: '',
    };
  },
  computed: {
    // 필터링된 항목 계산 및 페이지네이션을 위한 계산된 속성들
    filteredItems() {
      let filteredItems = this.items;

      // 필터링 조건에 따라 거래 항목을 필터링
      if (this.selectedType) {
        filteredItems = filteredItems.filter(
          (item) => item.type === this.selectedType
        );
      }

      if (this.selectedCategory) {
        filteredItems = filteredItems.filter(
          (item) => item.category === this.selectedCategory
        );
      }

      // 날짜 선택에 따라 거래 항목 필터링
      if (this.selectedDate) {
        filteredItems = filteredItems.filter(
          (item) =>
            new Date(item.date).toISOString().slice(0, 10) === this.selectedDate
        );
      }

      // 시작 날짜와 종료 날짜에 따라 거래 항목 필터링
      if (this.startDate && this.endDate) {
        filteredItems = filteredItems.filter((item) => {
          const itemDate = new Date(item.date);
          return (
            itemDate >= new Date(this.startDate) &&
            itemDate <= new Date(this.endDate)
          );
        });
      }

      return filteredItems;
    },
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredItems.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    // 추가: 유니크한 타입 값 추출
    types() {
      const uniqueTypes = [...new Set(this.items.map((item) => item.type))];
      return uniqueTypes.map((type) => {
        return {
          value: type,
          label: type === 'income' ? '수입' : '지출',
        };
      });
    },
    filteredCategories() {
      return this.selectedType === 'income'
        ? this.incomeCategories
        : this.selectedType === 'expense'
        ? this.expenseCategories
        : [];
    },
    visiblePageNumbers() {
      const maxVisiblePages = 5; // 표시되는 최대 페이지 번호 개수
      const totalVisiblePages = Math.min(this.totalPages, maxVisiblePages); // 표시되는 총 페이지 개수
      const firstVisiblePage = Math.max(
        this.currentPage - Math.floor(totalVisiblePages / 2),
        1
      ); // 첫 번째로 표시되는 페이지 번호
      const lastVisiblePage = Math.min(
        firstVisiblePage + totalVisiblePages - 1,
        this.totalPages
      ); // 마지막으로 표시되는 페이지 번호

      const visiblePages = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    },
  },
  watch: {
    // 날짜 선택 변경 감지
    selectedType() {
      this.updateCategories();
    },
    selectedDate() {
      // 날짜 선택 변경 시 필터링된 항목을 다시 계산
      this.filteredItems;
    },
    startDate() {
      // 시작 날짜 변경 시 필터링된 항목을 다시 계산
      this.filteredItems;
    },
    endDate() {
      // 종료 날짜 변경 시 필터링된 항목을 다시 계산
      this.filteredItems;
    },
  },
  methods: {
    fetchData() {
      axios
        .get('http://localhost:3000/budget')
        .then((response) => {
          this.items = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          this.updateBalances();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    updateCategories() {
      // 타입에 맞는 카테고리로 업데이트
      if (this.selectedType === 'income' || this.selectedType === 'expense') {
        this.selectedCategory = ''; // 전체로 설정
      }
    },

    updateBalances() {
      let balance = 0;
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        if (item.type === 'income') {
          balance += item.amount;
        } else if (item.type === 'expense') {
          balance -= item.amount;
        }
        item.balance = balance;
      }
    },

    filterByType() {
      if (this.selectedType === 'income') {
        this.selectedCategory = '월급';
      } else if (this.selectedType === 'expense') {
        this.selectedCategory = '식비';
      } else {
        this.selectedCategory = '';
      }
    },
    filterByDate() {
      this.filteredItems;
    },

    deleteItem(id) {
      axios
        .delete(`http://localhost:3000/budget/${id}`)
        .then(() => {
          this.items = this.items.filter((item) => item.id !== id);
          this.updateBalances();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    formatNumber(value) {
      return value.toLocaleString();
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },
    goToFirstPage() {
      this.currentPage = 1;
    },

    goToLastPage() {
      this.currentPage = this.totalPages;
    },
    exportToExcel() {
      if (!this.excelFileName.trim()) {
        // Trim the filename and check if it's empty
        window.alert('파일 이름을 입력하세요.'); // Show popup alert
        return; // Stop further execution
      }

      // Proceed with exporting to Excel
      const filteredData = this.filteredItems.map((item) => {
        const { id, ...rest } = item;
        return rest;
      });
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
      XLSX.writeFile(
        workbook,
        this.excelFileName.endsWith('.xlsx')
          ? this.excelFileName
          : `${this.excelFileName}.xlsx`
      );
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column; /* 자식 요소들을 세로로 정렬하기 위해 */
  align-items: center; /* 자식 요소들을 수직으로 가운데 정렬 */
}
.tablefilter,
.excel-button {
  margin-bottom: 20px; /* 각 요소들 사이의 간격을 조절합니다. */
}
.table-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.table-container {
  width: 100%;
  border-collapse: collapse;
}
.table-container th {
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  text-align: center;
}
.table-container td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

/* 짝수 번째 행 배경색 지정 */
.table-container tr:nth-child(even) {
  background-color: #f2f2f2;
}
.pagination {
  margin-top: 20px;
  text-align: center;
  justify-content: center;
}
.pagination button {
  margin: 0 5px;
}
.page-number {
  background-color: #ffffff; /* 페이지 번호 배경색 */
  border: 1px solid #ccc; /* 페이지 번호 테두리 */
  color: #333; /* 페이지 번호 글자색 */
  padding: 5px 10px; /* 페이지 번호 패딩 */
  margin: 0 2px; /* 페이지 번호 간격 */
  cursor: pointer; /* 페이지 번호 커서 */
}
.page-number.active {
  background-color: #007bff; /* 현재 페이지 배경색 */
  color: #ffffff; /* 현재 페이지 글자색 */
  border-color: #007bff; /* 현재 페이지 테두리 */
}
.button-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.income-type {
  color: blue; /* 글자색 */
  padding: 5px 10px; /* 내부 여백 */
  border-radius: 5px; /* 모서리 둥글게 */
}
.expense-type {
  color: red; /* 글자색 */
  padding: 5px 10px; /* 내부 여백 */
  border-radius: 5px; /* 모서리 둥글게 */
}
</style>
