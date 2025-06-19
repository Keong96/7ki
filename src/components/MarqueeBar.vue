<template>
  <div class="marquee-wrapper">
    <img
      class="marquee-icon"
      src="https://5j87f.7j0k2oqn.com/siteadmin/skin/lobby_asset/4-1-15/web/home/icon_dt_pmd.webp"
      alt="horn"
    />

    <div class="marquee-container">
      <div class="marquee-track">
        <div class="marquee-content" v-for="n in 2" :key="n">
          💗💗Welcome to www.7.ki Invite friends to join and you can earn money easily! users to join us, earn 18R$, user deposit 13R$ is valid💗💗
        </div>
      </div>
    </div>

    <img
      class="marquee-icon"
      src="https://5j87f.7j0k2oqn.com/siteadmin/skin/lobby_asset/4-1-15/common/_sprite/icon_dt_1xx.avif"
      alt="msg"
    />
  </div>
</template>

<style scoped>
.marquee-wrapper {
  display: flex;
  align-items: center;
  height: 36px;
  margin-top:25px;
  overflow: hidden;
  padding: 0 8px;
  position: relative;
  z-index: 1000;
}

.marquee-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  z-index: 2;
}

.marquee-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  margin: 0 8px;
}

.marquee-track {
  display: flex;
  white-space: nowrap;
  animation: scroll-left 5s linear infinite;
  align-items: center;
}

.marquee-content {
  padding-right: 60px;
  min-width: max-content;
  color: yellow;
  font-size: 14px;
  line-height: 36px;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
