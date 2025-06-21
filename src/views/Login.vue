<template>
  <div class="login-container">
    <!-- Logo -->
    <img
      src="https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830139652536532993.avif"
      alt="Logo"
      class="logo"
    />

    <!-- 登录/注册 切换 -->
    <div class="login-header">
      <button
        class="tab-btn"
        :class="{ active: mode === 'login' }"
      >
        Login
      </button>
      <span class="divider">|</span>
      <button
        class="tab-btn"
        :class="{ active: mode === 'register' }"
        @click="openRegister"
      >
        Register
      </button>
    </div>

    <!-- 登录表单 -->
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Username"
          required
        />
      </div>
      <div class="form-group password-group">
        <input
          id="password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
          required
        />
        <span class="toggle-password" @click="togglePassword">
          <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
        </span>
      </div>
      <div class="form-group remember-me">
        <label>
          <input type="checkbox" v-model="rememberMe" />
          Remember me
        </label>
      </div>
      <div class="form-actions">
        <button type="submit">Login</button>
      </div>
    </form>

    <!-- 错误提示 -->
    <transition name="fade">
      <div v-if="error" class="error-msg">{{ error }}</div>
    </transition>
  </div>

  <!-- 关闭按钮 -->
  <button class="close-btn" @click="close" aria-label="Close">
    <i class="bi bi-x-circle"></i>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { defineEmits } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'openRegister'): void
}>()

// 当前模式：login / register
const mode = ref<'login' | 'register'>('login')

// 表单数据
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

// 密码可见切换
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 用户状态
const userStore = useUserStore()

// 提交登录
const submitLogin = () => {
  const user = username.value.trim()
  const pass = password.value.trim()

  const validAccounts: Record<string, string> = {
    test: '123456',
    admin: 'admin',
  }

  if (!user || !pass) {
    error.value = 'Username and password required.'
    return
  }
  if (validAccounts[user] !== pass) {
    error.value = 'Invalid credentials.'
    return
  }

  // 模拟登录
  userStore.login({
    token: `FAKE_TOKEN_${user}`,
    nickname: user,
    userId: user,
  })

  error.value = ''
  emit('close')
}

// 打开注册弹窗
const openRegister = () => {
  emit('openRegister')
}

// 关闭弹窗
const close = () => {
  emit('close')
}
</script>

<style scoped>
.login-container {
  background: #b73c60;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 28vw;
  position: relative;
  color: white;
  margin: 2rem auto;
}
.logo {
  display: block;
  max-width: 120px;
  margin: 0 auto 1rem;
}
.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.tab-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
}

.tab-btn.active {
  font-weight: bold;
  text-decoration: underline;
}

.divider {
  color: #fff;
  font-size: 18px;
}
.form-group {
  margin-bottom: 1rem;
}
input[type='text'],
input[type='password'] {
  width: 100%;
  padding: 0.75rem;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  color: #fff;
  background: transparent;
}
input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
.password-group {
  position: relative;
}
.toggle-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 1.2rem;
}
.remember-me {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 14px;
}
.remember-me input[type='checkbox'] {
  margin-right: 6px;
  accent-color: #20f511;
  cursor: pointer;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.form-actions {
  margin-top: 1rem;
}
button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  background-color: #FFF0BB;
  color: #b73c60;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}
button[type='submit']:hover {
  background-color: #FFF0BB;
}
.error-msg {
  color: #ffd2d2;
  margin-top: 1rem;
  font-size: 14px;
  text-align: center;
}
.close-btn {
  display: block;
  margin: 2rem auto 0 auto;
  font-size: 40px;
  border: none;
  background: none;
  cursor: pointer;
  color: white;
  transition: color 0.2s ease;
}
.close-btn:hover {
  color: #eee;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .login-container {
    width: 75vw;
  }
}
</style>