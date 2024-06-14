<template>
  <div id="app">
    <h1>내용 수정</h1>
    <form @submit.prevent="updateTransaction" class="form">
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
      <button type="button" class="cancel-button" @click="goBack">취소</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        id: '',
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
        '주거',
        '통신',
        '문화생활',
        '쇼핑',
        '적금',
        '기타',
      ],
      formattedAmount: '',
    };
  },
  created() {
    this.fetchTransaction();
  },
  methods: {
    fetchTransaction() {
      const id = this.$route.params.id;
      axios.get(`http://localhost:3000/budget/${id}`).then((response) => {
        const data = response.data;
        this.form = { ...data };
        this.formattedAmount = this.form.amount.toLocaleString();
        this.updateCategories();
      });
    },
    updateTransaction() {
      const amountWithoutCommas = this.formattedAmount.replace(/,/g, '');
      const transaction = {
        ...this.form,
        amount: parseFloat(amountWithoutCommas),
      };
      axios
        .put(`http://localhost:3000/budget/${transaction.id}`, transaction)
        .then(() => this.$router.push('/list'))
        .catch((error) => console.error('Error updating transaction:', error));
    },
    goBack() {
      this.$router.back();
    },
    updateCategories() {
      this.categories =
        this.form.type === 'income'
          ? this.incomeCategories
          : this.expenseCategories;
      if (!this.categories.includes(this.form.category)) {
        this.form.category = this.categories[0];
      }
    },
    formatAmount() {
      const amount = parseFloat(this.formattedAmount.replace(/[^\d.]/g, ''));
      if (!isNaN(amount)) this.formattedAmount = amount.toLocaleString();
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-bottom: 10px;
}
input,
select,
button {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  box-sizing: border-box;
}
button {
  background-color: #776264;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}
button:hover {
  background-color: #6b5c5e;
}
.cancel-button {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  padding: 5px 10px;
  cursor: pointer;
}
.cancel-button:hover {
  background-color: #dddddd;
}
</style>
