<template>
  <div class="container">
    <h1>목록</h1>
    <br />
    <div id="tablefilter">
      <label for="startDateFilter">시작 날짜:</label>&nbsp;
      <input type="date" id="startDateFilter" v-model="startDate" />
      &nbsp;&nbsp;
      <label for="endDateFilter">종료 날짜:</label>&nbsp;
      <input type="date" id="endDateFilter" v-model="endDate" />
      &nbsp;&nbsp;
      <label for="typeFilter">타입:</label>&nbsp;
      <select id="typeFilter" v-model="selectedType" @change="updateCategories">
        <option value="">전체</option>
        <option v-for="type in types" :value="type.value">
          {{ type.label }}
        </option>
      </select>
      &nbsp;&nbsp;
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
      <button @click="goToFirstPage" :disabled="currentPage === 1"><<</button>
      <button @click="prevPage" :disabled="currentPage === 1"><</button>
      <span v-for="pageNumber in visiblePageNumbers" :key="pageNumber">
        <button
          @click="goToPage(pageNumber)"
          :class="{ active: currentPage === pageNumber }"
          class="page-number"
        >
          {{ pageNumber }}
        </button>
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        >
      </button>
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
      startDate: '',
      endDate: '',
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
    filteredItems() {
      let filteredItems = this.items;

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
      if (this.selectedDate) {
        filteredItems = filteredItems.filter(
          (item) =>
            new Date(item.date).toISOString().slice(0, 10) === this.selectedDate
        );
      }
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
    types() {
      const uniqueTypes = [...new Set(this.items.map((item) => item.type))];
      return uniqueTypes.map((type) => ({
        value: type,
        label: type === 'income' ? '수입' : '지출',
      }));
    },
    filteredCategories() {
      return this.selectedType === 'income'
        ? this.incomeCategories
        : this.selectedType === 'expense'
        ? this.expenseCategories
        : [];
    },
    visiblePageNumbers() {
      const maxVisiblePages = 5;
      const totalVisiblePages = Math.min(this.totalPages, maxVisiblePages);
      const firstVisiblePage = Math.max(
        this.currentPage - Math.floor(totalVisiblePages / 2),
        1
      );
      const lastVisiblePage = Math.min(
        firstVisiblePage + totalVisiblePages - 1,
        this.totalPages
      );

      const visiblePages = [];
      for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    },
  },
  watch: {
    selectedType() {
      this.updateCategories();
    },
    selectedDate() {
      this.filteredItems;
    },
    startDate() {
      this.filteredItems;
    },
    endDate() {
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
        .catch((error) => console.error('Error fetching data:', error));
    },
    updateCategories() {
      if (this.selectedType === 'income' || this.selectedType === 'expense') {
        this.selectedCategory = '';
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
    deleteItem(id) {
      axios
        .delete(`http://localhost:3000/budget/${id}`)
        .then(() => {
          this.items = this.items.filter((item) => item.id !== id);
          this.updateBalances();
        })
        .catch((error) => console.error('Error deleting item:', error));
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
        window.alert('파일 이름을 입력하세요.');
        return;
      }

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
  flex-direction: column;
  align-items: center;
}
.tablefilter,
.excel-button {
  margin-bottom: 20px;
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
.table-container th,
.table-container td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
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
  background-color: #ffffff;
  border: 1px solid #ccc;
  color: #333;
  padding: 5px 10px;
  margin: 0 2px;
  cursor: pointer;
}
.page-number.active {
  background-color: #007bff;
  color: #ffffff;
  border-color: #007bff;
}
.button-container {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.income-type {
  color: blue;
  padding: 5px 10px;
  border-radius: 5px;
}
.expense-type {
  color: red;
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
