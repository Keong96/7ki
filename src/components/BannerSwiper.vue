<template>
  <div class="banner-container">
    <Swiper
      :modules="[Autoplay, Pagination]"
      :loop="true"
      :autoplay="{ delay: 5000 }"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="(img, i) in images" :key="i">
        <img class="banner-img" :src="img" alt="banner" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>
  
<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const images = [
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830586026990112770.avif',
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830585888620146690.avif',
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830585752296259586.avif',
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1831959194505039874.avif',
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830586339285524482.avif',
  'https://5j87f.7j0k2oqn.com/siteadmin/upload/img/1830586177596448770.avif',
]
</script>
  
<style scoped>
.banner-container {
  width: 100%;
  margin-top: 75px;
  box-sizing: border-box;
}

.banner-img {
  width: 100%;
  max-height: 200px;
  height: auto;
  display: block;
  border-radius: 8px;
  object-fit: cover;
}
</style>