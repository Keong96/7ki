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
        <li
          v-for="cat in categoryList"
          :key="cat.refName"
          @click="goToCategory(cat.refName)"
        >
          {{ cat.label }}
        </li>
      </ul>
    </aside>

    <main>
      <BannerSwiper />
      <MarqueeBar />

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

      <div class="category-content">
        <section
          v-for="cat in categoryList"
          :key="cat.refName"
          :ref="el => setSectionRef(cat.refName, el)"
          class="category-section"
        >
          <div class="category-header">
            <h2>{{ cat.label }}</h2>
            <button class="view-all-btn" @click="goToCategory(cat.refName)">All</button>
          </div>

          <div class="games-grid">
            <div
              v-for="game in (categoryGames[cat.refName]?.slice(0, Number(displayCount[cat.refName])) || [])"
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
              Showing {{ displayCount[cat.refName] }} out of {{ categoryGames[cat.refName]?.length }} {{ cat.label }} games
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
            <img src="https://5j87f.7j0k2oqn.com/siteadmin/skin/lobby_asset/common/common/common/18plus.avif" alt="18+" class="contact-icon">
          </div>
        </div>

        <div class="footer-company-info">
          <p><strong>WG</strong></p>
          <p>The Group is the world’s best-known online gambling operator...</p>
          <p>Licensed and regulated by the Government of Curacao...</p>
        </div>
      </footer>
    </main>

    <nav class="bottom-nav">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        :class="{ active: currentTab === tab.name }"
        @click="switchTab(tab.name)"
      >
        <img :src="tab.icon" alt="icon" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <transition name="modal-fade">
      <div class="modal-overlay" v-if="activeModal" @click.self="closeModals">
        <div class="modal-content">
          <Login v-if="activeModal === 'login'" @close="closeModals" @openRegister="openRegister" />
          <Register v-if="activeModal === 'register'" @close="closeModals" @openLogin="openLogin" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { fetchGameList, launchGame } from '@/utils/api'
import { useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import BannerSwiper from '@/components/BannerSwiper.vue'
import MarqueeBar from '@/components/MarqueeBar.vue'
import type { GameItem } from '@/utils/api'

const router = useRouter()
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
const categoryGames = ref<Record<string, GameItem[]>>({})
const displayCount = ref<Record<string, number>>({})
const displayLimit = 9

const loadGames = async () => {
  const res = await fetchGameList()
  gameList.value = res

  const availableCategories = categoryList.value.filter(c => c.refName !== 'recent')
  const total = availableCategories.length
  const distributed: Record<string, GameItem[]> = {}

  gameList.value.forEach((game, idx) => {
    const ref = availableCategories[idx % total].refName
    if (!distributed[ref]) distributed[ref] = []
    distributed[ref].push(game)
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
  displayCount.value[refName] = Math.min(current + displayLimit, total)
}

const goToCategory = (refName: string) => {
  router.push({ name: 'CategoryPage', params: { refName } })
}

const sectionRefs = ref<Record<string, HTMLElement>>({})
const setSectionRef = (name: string, el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLElement) {
    sectionRefs.value[name] = el
  } else if (el && '$el' in el && el.$el instanceof HTMLElement) {
    sectionRefs.value[name] = el.$el
  }
}

const scrollTo = (refName: string) => {
  const el = sectionRefs.value[refName]
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const launchSelectedGame = async (game: GameItem) => {
  if (!userStore.userId) {
    activeModal.value = 'login'
    return
  }
  const url = await launchGame(game.ID, String(userStore.userId))
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
  { name: 'profile', label: 'Profile', icon: '/icons/icon_btm_wd.avif' }
]
const currentTab = ref('home')
const switchTab = (name: string) => { currentTab.value = name }

const activeModal = ref<'login' | 'register' | null>(null)
const openLogin = () => { activeModal.value = 'login' }
const openRegister = () => { activeModal.value = 'register' }
const closeModals = () => { activeModal.value = null }

const goToSearch = () => router.push({ name: 'Search' })
const goToDeposit = () => router.push('/deposit')

onMounted(() => {
  loadGames()

  const strip = document.querySelector('.category-strip')
  if (!strip) return

  let isDown = false, startX = 0, scrollLeft = 0

  strip.addEventListener('mousedown', (e) => {
    isDown = true
    strip.classList.add('dragging')
    startX = e.pageX - strip.getBoundingClientRect().left
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
    const x = e.pageX - strip.getBoundingClientRect().left
    strip.scrollLeft = scrollLeft - (x - startX) * 1.5
  })
})
</script>

<style scoped>
/* 原样保留你的 style，未改动，已合并在你现有项目中 */
</style>
