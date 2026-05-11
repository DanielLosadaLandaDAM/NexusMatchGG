<template>
  <div class="nexusmatch-logo" @click="$router.push('/')">
    <h1 class="logo-texto" :style="{ fontSize: tamanoPersonalizado + 'px' }">
      NEXUSMATCH <span class="neon-gg">GG</span>
    </h1>
  </div>
</template>

<script setup>
defineProps({
  tamanoPersonalizado: {
    type: String,
    default: '38'
  }
});
</script>

<style scoped>
.nexusmatch-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.logo-texto {
  font-family: 'Arial Black', sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.neon-gg {
  color: #17bbba;
  text-shadow: 0 0 10px rgba(23, 187, 186, 0.5);
}

@media (max-width: 900px) {
  .logo-texto { font-size: 24px !important; }
}
</style>