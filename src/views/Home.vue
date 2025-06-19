<template>
  <div class="home-page">
    <header class="header">
      <div class="logo-container">
      <button class="menu-btn" @click="toggleSidebar">☰</button>
        <img src="https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830139652536532993.avif" alt="Logo" class="logo" />
      </div>
      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
          <button class="btn" @click="openLogin">Login</button>
          <button class="btn" @click="openRegister">Register</button>
        </template>
        <template v-else>
          <button class="btn balance-btn">Balance: {{ balanceDisplay }}</button>
          <button class="btn" @click="goToDeposit">Deposit</button>
        </template>
        <button class="btn search-btn" @click="goToSearch"><i class="fas fa-search"></i></button>
      </div>
    </header>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <h3>Category</h3>
      <ul>
        <li v-for="category in categories" :key="category" @click="selectCategory(category)">
          {{ category }}
        </li>
      </ul>
    </aside>

    <main>
      <BannerSwiper />
      
      <MarqueeBar />

      <!-- 横向分类栏 -->
      <div class="category-strip">
        <div
          v-for="cat in categoryList"
          :key="cat.refName"
          class="category-tab"
          @click="scrollTo(cat.refName)"
        >
          {{ cat.label }}
        </div>
      </div>

      <!-- 分类内容区域 -->
      <div class="category-content">
        <section
          v-for="cat in categoryList"
          :key="cat.refName"
          :ref="setSectionRef(cat.refName)"
          class="category-section"
        >
          <div class="category-header">
            <h2>{{ cat.label }}</h2>
            <button class="view-all-btn" @click="goToCategory(cat.refName)">All</button>
          </div>
          
          <div class="games-grid">
            <div
              v-for="game in (categoryGames[cat.refName]?.slice(0, displayCount[cat.refName]) || [])"
              :key="game.ID"
              class="game-card"
              @click="launchSelectedGame(game)"
            >
              <img :src="`https://popapi.cc${game.IconUrl}`" :alt="game.Name" />
              <div class="game-name">{{ game.Name }}</div>
            </div>
          </div>

          <div
            v-if="(categoryGames[cat.refName]?.length || 0) > displayCount[cat.refName]"
            class="load-more-trigger"
            @click="loadMoreGames(cat.refName)"
          >
            <div class="game-count-info">
              Showing {{ displayCount[cat.refName] }} games out of
              {{ categoryGames[cat.refName]?.length }} {{ cat.label }} games
            </div>
            <span>Load More</span>
            <i class="down-arrow-icon">
              <svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L1 4h10L6 9z"/>
              </svg>
            </i>
          </div>
        </section>
      </div>

      <footer class="footer">
        <div class="footer-links">
          <div class="footer-column">
            <h4 class="footer-title">Cassino</h4>
            <ul class="footer-list">
              <li>Events</li>
              <li>Mission</li>
              <li>Bonus</li>
              <li>VIP</li>
              <li>Agent</li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 class="footer-title">Games</h4>
            <ul class="footer-list">
              <li>Popular</li>
              <li>Cards</li>
              <li>Fishery</li>
              <li>Slots</li>
              <li>Live</li>
              <li>Sport</li>
              <li>Blockchain</li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-list">
              <li>Support</li>
              <li>Help Center</li>
              <li>Suggestion Bonus</li>
            </ul>
          </div>
        </div>

        <div class="footer-contact">
          <h4 class="footer-title">Contact Us</h4>
          <div class="contact-icons">
            <img src="https://5j87f.7j0k2oqn.com/siteadmin/skin/lobby_asset/common/common/common/18plus.avif?manualVersion=1&version=10fea753dc" alt="18+" class="contact-icon">
          </div>
        </div>

        <div class="footer-company-info">
          <p><strong>WG</strong></p>
          <p>
            The Group is the world’s best-known online gambling operating company,
            offering exciting and entertaining live dealer casinos, chess and cards,
            electronics, fishing, lottery, sports and other comprehensive gaming
            categories.
          </p>
          <p>
            Licensed and regulated by the Government of Curacao and operating under
            License No. Antillephone. It has passed all compliance checks and is
            legally authorized to conduct all gambling and betting operations.
          </p>
        </div>
      </footer>
    </main>

    <nav class="bottom-nav">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="switchTab(tab.name)"
      >
        <img :src="tab.icon" alt="icon" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <!-- 登录/注册弹窗 -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="activeModal" @click.self="closeModals">
        <div class="modal-content">
          <Login
            v-if="activeModal === 'login'"
            @close="closeModals"
            @openRegister="openRegister"
          />
          <Register
            v-if="activeModal === 'register'"
            @close="closeModals"
            @openLogin="openLogin"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import Login from './Login.vue'
import Register from './Register.vue'
import { fetchGameList, GameItem, launchGame } from '@/utils/api'
import BannerSwiper from '@/components/BannerSwiper.vue'
import MarqueeBar from '@/components/MarqueeBar.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const balanceDisplay = computed(() => `$${parseFloat(userStore.balance).toFixed(2)}`)

const categoryList = ref([
  { label: 'Popular', refName: 'popular' },
  { label: 'Cards', refName: 'cards' },
  { label: 'Fishing', refName: 'fishing' },
  { label: 'Slots', refName: 'slots' },
  { label: 'Live', refName: 'live' },
  { label: 'Sport', refName: 'sport' },
  { label: 'BlockChain', refName: 'blockchain' },
  { label: 'Recent', refName: 'recent' }
])

const gameList = ref<GameItem[]>([])
const displayLimit = 9
const categoryGames = ref<Record<string, GameItem[]>>({})
const displayCount = ref<Record<string, number>>({})

const loadGames = async () => {
  const res = await fetchGameList()
  gameList.value = res;

  // 除 recent 外的分类
  const availableCategories = categoryList.value.filter(c => c.refName !== 'recent')
  const totalCategories = availableCategories.length

  // 均分游戏到每个分类
  const distributed: Record<string, GameItem[]> = {}
  gameList.value.forEach((game, index) => {
    const catIndex = index % totalCategories
    const catRef = availableCategories[catIndex].refName
    if (!distributed[catRef]) distributed[catRef] = []
    distributed[catRef].push(game)
  })

  categoryList.value.forEach(cat => {
    const list = distributed[cat.refName] || []
    categoryGames.value[cat.refName] = list
    displayCount.value[cat.refName] = Math.min(displayLimit, list.length)
  })
}

const loadMoreGames = (refName: string) => {
  const total = categoryGames.value[refName]?.length || 0
  const current = displayCount.value[refName] || 0
  const next = Math.min(current + 9, total)
  displayCount.value[refName] = next
}

const goToCategory = (refName: string) => {
  router.push({ name: 'CategoryPage', params: { refName } })
}

const sectionRefs = ref<Record<string, HTMLElement>>({})

const setSectionRef = (name: string) => (el: HTMLElement | null) => {
  if (el) sectionRefs.value[name] = el
}

const scrollTo = (refName: string) => {
  const el = sectionRefs.value[refName]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const launchSelectedGame = async (game) => {
  if (!userStore.userId) {
    activeModal.value = 'login'
    return
  }

  const url = await launchGame(game.ID, userStore.userId)
  if (url) window.open(url, '_blank')
}

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const tabs = [
  { name: 'home', label: 'Home', icon: '/icons/icon_btm_sy.avif' },
  { name: 'promo', label: 'Promotion', icon: '/icons/icon_btm_yh.avif' },
  { name: 'agent', label: 'Agent', icon: '/icons/icon_btm_tg.avif' },
  { name: 'support', label: 'Support', icon: '/icons/icon_btm_kf.avif' },
  { name: 'profile', label: 'Profile', icon: '/icons/icon_btm_wd.avif' },
]

const currentTab = ref('home')
const switchTab = (tabName: string) => {
  currentTab.value = tabName
}

const activeModal = ref<'login' | 'register' | null>(null)
const openLogin = () => {
  activeModal.value = 'login'
}

const openRegister = () => {
  activeModal.value = 'register'
}

const closeModals = () => {
  activeModal.value = null
}

const goToSearch = () => {
  router.push({ name: 'Search' })
}

onMounted(() => {
  loadGames();
  const strip = document.querySelector('.category-strip')
  let isDown = false
  let startX: number
  let scrollLeft: number

  if (!strip) return

  strip.addEventListener('mousedown', (e) => {
    isDown = true
    strip.classList.add('dragging')
    startX = e.pageX - strip.offsetLeft
    scrollLeft = strip.scrollLeft
  })

  strip.addEventListener('mouseleave', () => {
    isDown = false
    strip.classList.remove('dragging')
  })

  strip.addEventListener('mouseup', () => {
    isDown = false
    strip.classList.remove('dragging')
  })

  strip.addEventListener('mousemove', (e) => {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - strip.offsetLeft
    const walk = (x - startX) * 1.5 // adjust scroll speed
    strip.scrollLeft = scrollLeft - walk
  })
})
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.home-page {
  max-width: 33vw;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #e06f8b;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
main {
  flex: 1;
  overflow-y: auto;
}
main::-webkit-scrollbar {
  display: none;
}
.header {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 33vw;
  height: 50px;
  background: #b73c60;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  z-index: 1100;
  box-sizing: border-box;
}
.menu-btn {
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}
.logo-container {
  display: flex;
  align-items: center;
}
.logo-container img {
  height: 24px;
  max-width: 100px;
  object-fit: contain;
}
.auth-buttons .btn {
  color: white;
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
}
.auth-buttons .btn:hover {
  text-decoration: underline;
}
.balance-btn {
  background-color: #e0f7fa;
  color: #00796b;
  font-weight: bold;
}
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 33vw;
  height: 65px;
  background: #c54f72;
  border-top: 1px solid #ddd;
  display: flex;
  z-index: 1100;
  box-sizing: border-box;
}
.bottom-nav button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 12px;
  cursor: pointer;
  color: #fff;
  transition: color 0.2s ease;
  padding: 4px 0;
}
.bottom-nav button img {
  width: 22px;
  height: 22px;
  margin-bottom: 4px;
}
.bottom-nav button.active {
  color: #fffb00;
  font-weight: bold;
}
.bottom-nav button.active img {
  filter: brightness(1.2) saturate(1.5);
}
.sidebar {
  position: fixed;
  top: 50px;
  width: 15vw;
  height: calc(100vh - 100px);
  background: #f9f9f9;
  box-shadow: 2px 0 5px rgba(0,0,0,0.2);
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  z-index: 1050;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}
.sidebar.open {
  opacity: 1;
  visibility: visible;
}
.sidebar h3 {
  margin-bottom: 10px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 6px;
}
.sidebar ul li:hover {
  background-color: #42b983;
  color: white;
}
.overlay {
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 100px);
  background: rgba(0,0,0,0.4);
  z-index: 1040;
}
.category-content {
  margin-bottom: 50px;
  padding: 10px;
  overflow: visible;
  box-sizing: border-box;
}
.category-content::-webkit-scrollbar {
  display: none;
}
.category-content h2 {
  margin-bottom: 10px;
  color: white;
}
.games-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  padding: 25px 0px 0px 25px;
}
.game-card {
  position: relative;
  width: 30%;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 38px;
  overflow: hidden;
  text-align: center;
  padding: 0;
  margin: 2px;
  box-sizing: border-box;
  transition: box-shadow 0.2s ease;
}
.game-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  z-index: 1;
  position: relative;
}
.game-name {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.7);
  pointer-events: none;
  z-index: 2;
}

.search-btn i {
  font-size: 16px;
  color: white;
}

.load-more-trigger {
  text-align: center;
  cursor: pointer;
  padding: 1rem 0;
  font-size: 14px;
  color: #fff;
}

.trigger-text {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  color: #ffffff;
}

.down-arrow-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1em;
  height: 1em;
}

.category-strip {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 10px;
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-strip::-webkit-scrollbar {
  display: none;
}

.category-tab {
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
}

.category-section {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.category-header h2 {
  color: white;
  font-size: 18px;
  margin: 0;
}
.view-all-btn {
  font-size: 13px;
  background: none;
  border: none;
  color: #ffffff;
  text-decoration: underline;
  cursor: pointer;
  padding: 4px 8px;
}
@media (max-width: 600px) {
  .home-page {
    max-width: 100vw;
  }
  .header,
  .bottom-nav {
    width: 100vw;
    left: 0;
    transform: none;
  }
  .sidebar {
    left: 0;
    width: 250px;
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .content {
    margin-top: 50px;
    margin-bottom: 50px;
    height: auto;
  }
  .game-card {
    width: 45%;
  }
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  position: relative;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.footer {
  padding: 2rem;
  background-color: #b73c60;
  font-size: 0.9rem;
  color: #333;
}
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.footer-column {
  min-width: 150px;
}
.footer-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-list li {
  margin-bottom: 0.3rem;
  cursor: pointer;
}
.footer-contact {
  margin-bottom: 1.5rem;
}
.contact-icons {
  display: flex;
  gap: 0.5rem;
}
.contact-icon {
  width: 24px;
  height: 24px;
}
.footer-company-info {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
}
</style>

