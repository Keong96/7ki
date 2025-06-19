import { defineStore } from 'pinia'
import { getUserBalance } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    nickname: '',
    userId: '',
    isLoggedIn: false,
    balance: 0
  }),

  actions: {
    async login(payload) {
      this.token = payload.token
      this.nickname = payload.nickname || ''
      this.userId = payload.userId || ''
      this.isLoggedIn = true
      // this.balance = await getUserBalance(this.userId) ?? 0;
      this.balance = 100
    },

    logout() {
      this.token = ''
      this.nickname = ''
      this.userId = ''
      this.isLoggedIn = false
      this.balance = 0
    },
  }
})