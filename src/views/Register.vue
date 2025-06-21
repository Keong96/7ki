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
        @click="openLogin"
      >
        Login
      </button>
      <span class="divider">|</span>
      <button
        class="tab-btn"
        :class="{ active: mode === 'register' }"
      >
        Register
      </button>
    </div>

    <!-- 注册表单 -->
    <form @submit.prevent="submitRegister">
      <div class="form-group">
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Username"
          required
        />
      </div>
      <div class="form-group">
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="Email"
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
      <div class="form-group password-group">
        <input
          id="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          required
        />
      </div>
      <div class="form-group checkbox-group">
        <input
          id="agree"
          type="checkbox"
          v-model="agreed"
          required
        />
        <label for="agree">
          I am over 18 years old, and I have read and agree to the
          <a href="/user-agreement" target="_blank" rel="noopener">
            <u>User Agreement</u>
          </a>.
        </label>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="!agreed">Register</button>
      </div>
    </form>

    <!-- 错误提示 -->
    <transition name="fade">
      <div v-if="error" class="error-msg">{{ error }}</div>
    </transition>
  </div>

  <!-- 关闭按钮 放在正下方 -->
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
  (e: 'openLogin'): void
}>()

// 切换标签用的状态
const mode = ref<'login' | 'register'>('register')

// 表单数据
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreed = ref(false)
const error = ref('')

// 密码可见切换
const showPassword = ref(false)
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 用户状态
const userStore = useUserStore()

// 提交注册
const submitRegister = () => {
  // 简单校验
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'All fields are required.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (!agreed.value) {
    error.value = 'You must agree to the user agreement.'
    return
  }

  // 模拟注册并登录
  userStore.login({
    token: `FAKE_TOKEN_${username.value}`,
    nickname: username.value,
    userId: username.value,
  })

  error.value = ''
  emit('close')
}

// 关闭弹窗
const close = () => {
  emit('close')
}

// 切换到登录
const openLogin = () => {
  emit('openLogin')
}
</script>

<style scoped>
/* 注意：和 Login.vue 保持一致的主容器样式 */
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

/* Logo */
.logo {
  display: block;
  max-width: 120px;
  margin: 0 auto 1rem;
}

/* Login/Register 切换 */
.login-header {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tab-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  padding: 0 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}
.tab-btn.active {
  color: #fff;
  font-weight: bold;
}
.divider {
  color: rgba(255, 255, 255, 0.5);
}

/* 表单组 */
.form-group {
  margin-bottom: 1rem;
}
input[type='text'],
input[type='email'],
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

/* 密码可见切换 */
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
  user-select: none;
}

/* 同 Login.vue */
.checkbox-group {
  display: flex;
  align-items: center;
}
.checkbox-group input[type='checkbox'] {
  margin-right: 6px;
  accent-color: #20f511;
  cursor: pointer;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.checkbox-group label {
  color: #fff;
  font-size: 14px;
}

/* 提交按钮 */
.form-actions {
  margin-top: 1rem;
}
button[type='submit'] {
  width: 100%;
  padding: 0.75rem;
  background-color: #fff0bb;
  color: #b73c60;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}
button[type='submit']:hover {
  background-color: #fff0bb;
}

/* 错误提示 */
.error-msg {
  color: #ffd2d2;
  margin-top: 1rem;
  font-size: 14px;
  text-align: center;
}

/* 关闭按钮 */
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

/* 淡入淡出效果 */
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
