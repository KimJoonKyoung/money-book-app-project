<template>
  <div>
    <h1>List View</h1>
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
          <!-- <td>{{ item.amount }}</td> -->
          <td>{{ formatNumber(item.amount) }}</td>
          <td>{{ formatNumber(item.balance) }}</td>
          <!-- <td>{{ item.balance }}</td> -->
          <td>
            <button @click="editItem(item.id)">편집</button>
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
    };
  },
  computed: {
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.items.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get('http://localhost:3000/budget')
        .then((response) => {
          this.items = response.data;
          this.updateBalances(); // 잔액을 가져올 때마다 재계산
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },

    updateBalances() {
      let balance = 0;
      this.items.forEach((item) => {
        if (item.type === 'income') {
          balance += item.amount;
        } else if (item.type === 'expense') {
          balance -= item.amount;
        }
        item.balance = balance;
      });
    },
    editItem(id) {
      console.log('Edit item with id:', id);
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
    formatNumber(number) {
      // 숫자 포맷팅하여 쉼표 추가
      return number.toLocaleString();
    },
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
