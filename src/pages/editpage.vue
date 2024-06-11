<template>
  <div id="app">
    <h1>내용 추가 (가제)</h1>
    <form @submit.prevent="addTransaction" class="form">
      <input type="date" v-model="form.date" required class="input-field" />
      <input
        type="text"
        v-model="form.memo"
        placeholder="내용을 입력하세요"
        required
        class="input-field"
      />
      <select
        v-model="form.type"
        @change="updateCategories"
        required
        class="input-field"
      >
        <option value="" disabled>선택</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
      <select v-model="form.category" required>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
      <input
        type="text"
        v-model="formattedAmount"
        @input="formatAmount"
        placeholder="금액"
        required
      />
      <button type="submit">저장</button>
      <button type="button" class="cancel-button" @click="resetForm">
        취소
      </button>
    </form>
  </div>
</template>
<script>
import axios from 'axios';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      transactions: [],
      form: {
        date: '',
        type: '',
        category: '',
        amount: '',
        memo: '',
      },
      categories: [],
      incomeCategories: ['월급', '이자', '용돈', '이월', '기타'],
      expenseCategories: [
        '식비',
        '교통',
        '주거통신',
        '문화생활',
        '쇼핑',
        '적금',
        '기타',
      ],
      formattedAmount: '',
    };
  },
  created() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      axios.get('http://localhost:3000/budget').then((response) => {
        this.transactions = response.data;
      });
    },
    addTransaction() {
      // 쉼표를 제거하고 숫자로 변환합니다.
      const amountWithoutCommas = this.formattedAmount.replace(/,/g, '');
      const transaction = {
        ...this.form,
        // 쉼표를 제거한 값을 저장합니다.
        amount: parseFloat(amountWithoutCommas),
      };
      axios
        .post('http://localhost:3000/budget', transaction)
        .then((response) => {
          this.resetForm();
        })
        .catch((error) => {
          console.error('Error adding transaction:', error);
        });
    },
    resetForm() {
      this.form = {
        date: '',
        type: '',
        category: '',
        amount: '',
        memo: '',
      };
      this.formattedAmount = '';
      this.updateCategories();
    },
    updateCategories() {
      this.categories =
        this.form.type === 'income'
          ? this.incomeCategories
          : this.expenseCategories;
      this.form.category = this.categories[0];
    },
    formatAmount() {
      // 입력된 값에서 숫자와 소수점을 제외한 모든 문자를 제거합니다.
      let amount = this.formattedAmount.replace(/[^\d.]/g, '');
      // 숫자 형태로 변환합니다.
      amount = parseFloat(amount);
      // 만약 입력된 값이 숫자가 아니라면 무시합니다.
      if (isNaN(amount)) return;
      // 숫자를 천단위 구분 기호가 추가된 문자열로 포맷합니다.
      this.formattedAmount = amount.toLocaleString();
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 10px; /* Adjusted margin for uniform spacing */
}
input,
select,
button {
  width: 100%;
  padding: 10px;
  margin-top: 10px; /* Adjusted margin for uniform spacing */
  box-sizing: border-box;
}
button {
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px; /* Ensure button has a consistent margin */
}
button:hover {
  background-color: #2ecc71;
}
.cancel-button {
  background-color: #ffffff; /* 하얀 배경 */
  color: #000000; /* 검은 텍스트 */
  border: 1px solid #000000; /* 검은 테두리 */
  padding: 5px 10px; /* 내부 여백 */
  cursor: pointer; /* 마우스 오버 시 커서 모양 */
}
.cancel-button:hover {
  background-color: #dddddd; /* 마우스 오버 시 배경색 변경 */
}
</style>
