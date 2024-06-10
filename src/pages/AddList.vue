<template>
  <div class="container">
    <h1>사용 내역</h1>
    <form @submit.prevent="saveAccount">
      <div class="form-group">
        <label for="date">날짜</label>
        <input type="date" v-model="account.date" required />
      </div>
      <div class="form-group">
        <label for="description">상세 내용</label>
        <input
          type="text"
          v-model="account.description"
          placeholder="텍스트를 입력해주세요"
          required
        />
      </div>
      <div class="form-group">
        <label for="type">분류</label>
        <select v-model="account.type">
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select>
      </div>
      <div class="form-group">
        <label for="tag">태그</label>
        <select v-model="account.tag">
          <!-- 태그 옵션 추가 -->
        </select>
      </div>
      <div class="form-group">
        <label for="amount">금액</label>
        <input
          type="number"
          v-model="account.amount"
          placeholder="금액을 입력해주세요"
          required
        />
      </div>
      <button type="submit">저장</button>
      <button type="button" @click="cancel">취소</button>
    </form>
    <div class="fixed-button-container">
      <button type="submit">저장</button>
      <button type="button" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useTodoListStore } from '@/stores/todoList.js';

export default {
  setup() {
    const router = useRouter();
    const { addTodo } = useTodoListStore();

    const account = reactive({
      date: '',
      description: '',
      type: 'income',
      tag: '',
      amount: '',
    });

    const saveAccount = () => {
      if (!account.date || !account.description || !account.amount) {
        alert('모든 필드를 입력하세요.');
        return;
      }
      addTodo(
        {
          todo: account.description,
          desc: account.tag,
          done: false,
        },
        () => {
          router.push('/todos');
        }
      );
    };

    const cancel = () => {
      router.push('/todos');
    };

    return { account, saveAccount, cancel };
  },
};
</script>

<style scoped></style>
