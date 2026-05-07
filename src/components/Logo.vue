<template>
  <div class="brand-logo" @click="$router.push('/')">
    <h1 class="logo-text" :style="{ fontSize: size + 'px' }">
      NEXUSMATCH <span class="gg-highlight">GG</span>
    </h1>
  </div>
</template>

<script setup>
// Definimos una 'prop' por si queremos que el logo sea más grande en un sitio que en otro
defineProps({
  size: {
    type: String,
    default: '38'
  }
});
</script>

<style scoped>
.brand-logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.logo-text {
  font-family: 'Arial Black', sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.gg-highlight {
  color: #17bbba;
  text-shadow: 0 0 10px rgba(23, 187, 186, 0.5);
}

/* Responsivo básico para el componente */
@media (max-width: 900px) {
  .logo-text { font-size: 24px !important; }
}
</style>