// import { defineStore } from 'pinia';
// import axios from 'axios';

// export const useBudgetStore = defineStore('budget', {
//   state: () => ({
//     budget: [],
//   }),
//   actions: {
//     async fetchBudget() {
//       const response = await axios.get('http://localhost:3000/budget');
//       this.budget = response.data;
//       this.updateBalances();
//     },
//     updateBalances() {
//       let balance = 0;
//       this.budget.forEach((entry) => {
//         if (entry.type === 'income') {
//           balance += entry.amount;
//         } else if (entry.type === 'expense') {
//           balance -= entry.amount;
//         }
//         entry.balance = balance;
//       });
//     },
//     async addEntry(entry) {
//       const response = await axios.post('http://localhost:3000/budget', entry);
//       this.budget.push(response.data);
//       this.updateBalances();
//     },
//     async deleteEntry(id) {
//       await axios.delete(`http://localhost:3000/budget/${id}`);
//       this.budget = this.budget.filter((entry) => entry.id !== id);
//       this.updateBalances();
//     },
//   },
// });
