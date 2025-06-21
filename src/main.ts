import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'

import { useUserStore } from '@/store/user'

const app = createApp(App)

const pinia = createPinia()
app.use(i18n)
app.use(pinia)

useUserStore().restore()

app.use(router)
app.mount('#app')
