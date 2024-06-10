<template>
  <div>
    <h1>List View</h1>
    <table class="table-container">
      <!-- 테이블 헤더 -->
      <thead>
        <tr>
          <th>날짜</th>
          <th>타입</th>
          <th>카테고리</th>
          <th>상세 카테고리</th>
          <th>금액</th>
          <th>메모</th>
          <th>동작</th>
        </tr>
      </thead>
      <!-- 테이블 내용 -->
      <tbody>
        <tr v-for="(item, index) in displayedItems" :key="item.id">
          <td>{{ item.date }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.detailCategory }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.memo }}</td>
          <td>
            <button @click="editItem(item.id)">편집</button>
            <button @click="deleteItem(item.id)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 페이지네이션 -->
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
      items: [], // 전체 항목
      itemsPerPage: 10, // 페이지당 항목 수
      currentPage: 1, // 현재 페이지
    };
  },
  computed: {
    // 현재 페이지에 표시되는 항목
    displayedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.items.slice(startIndex, endIndex);
    },
    // 전체 페이지 수
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
        .get('db.json')
        .then((response) => {
          this.items = response.data.budget;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    },
    editItem(id) {
      // 편집 버튼 클릭 시 실행되는 로직 추가
      console.log('Edit item with id:', id);
    },
    deleteItem(id) {
      // 삭제 버튼 클릭 시 실행되는 로직 추가
      console.log('Delete item with id:', id);
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
