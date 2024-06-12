<template>
  <div>
    <h1>List View</h1>

    <div>
      <label for="startDateFilter">시작 날짜:</label>
      <input type="date" id="startDateFilter" v-model="startDate" />

      <label for="endDateFilter">종료 날짜:</label>
      <input type="date" id="endDateFilter" v-model="endDate" />

      <label for="typeFilter">타입:</label>
      <select id="typeFilter" v-model="selectedType" @change="updateCategories">
        <option value="">전체</option>
        <option v-for="type in types" :value="type">{{ type }}</option>
      </select>

      <label for="categoryFilter">카테고리:</label>
      <select id="categoryFilter" v-model="selectedCategory">
        <option value="">전체</option>
        <option v-for="category in filteredCategories" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

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
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.memo }}</td>
          <td>{{ formatNumber(item.amount) }}</td>
          <td>{{ formatNumber(item.balance) }}</td>
          <td>
            <router-link :to="{ name: 'Update', params: { id: item.id } }">
              <button>편집</button> </router-link
            >&nbsp;
            <button @click="deleteItem(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        다음
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
        '주거,통신',
        '문화생활',
        '쇼핑',
        '적금',
        '기타',
      ],
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
      return [...new Set(this.items.map((item) => item.type))];
    },
    filteredCategories() {
      return this.selectedType === 'income'
        ? this.incomeCategories
        : this.selectedType === 'expense'
        ? this.expenseCategories
        : [];
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
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.table-container {
  width: 100%;
  border-collapse: collapse;
}

.table-container th,
.table-container td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table-container th {
  background-color: #f2f2f2;
  text-align: left;
}

.table-container tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
}
</style>
