import { defineStore } from 'pinia';
import axios from 'axios';
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
  }),
  actions: {
    async fetchUsername() {
      try {
        const response = await axios.get('http://localhost:3000/user');
        this.username = response.data.username;
      } catch (error) {
        console.error('Failed to fetch username:', error);
      }
    },
    async setUsername(username) {
      try {
        await axios.put('http://localhost:3000/user', { username });
        this.username = username;
      } catch (error) {
        console.error('Failed to set username:', error);
      }
    },
  },
});
