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
    async login(payload: { token: string; nickname: string; userId: string }) {
      this.token = payload.token
      this.nickname = payload.nickname || ''
      this.userId = payload.userId || ''
      this.isLoggedIn = true
      // this.balance = await getUserBalance(this.userId) ?? 0;
      this.balance = 100

      localStorage.setItem('userStore', JSON.stringify({
        token: this.token,
        nickname: this.nickname,
        userId: this.userId,
        isLoggedIn: this.isLoggedIn,
        balance: this.balance
      }))
    },

    logout() {
      this.token = ''
      this.nickname = ''
      this.userId = ''
      this.isLoggedIn = false
      this.balance = 0
      localStorage.removeItem('userStore')
    },

    restore() {
      const saved = localStorage.getItem('userStore')
      if (!saved) return
      
      const data = JSON.parse(saved)
      this.token = data.token || ''
      this.nickname = data.nickname || ''
      this.userId = data.userId || ''
      this.isLoggedIn = !!data.isLoggedIn
      this.balance = data.balance ?? 0
    }
  }
})