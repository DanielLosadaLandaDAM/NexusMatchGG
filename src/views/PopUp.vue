<template>
  <div v-if="!hasAccepted" class="cookie-overlay">
    <div class="cookie-card">
      <div class="cookie-header">
        <div class="icon-box">🍪</div>
        <h2>CONFIGURACIÓN DE PRIVACIDAD</h2>
      </div>

      <div class="cookie-body">
        <p>
          En <strong>NexusMatchGG</strong> utilizamos cookies para optimizar tu búsqueda de compañeros, 
          analizar el tráfico y mejorar tu experiencia con nuestra IA de matchmaking.
        </p>
        <p class="small-text">
          Al hacer clic en "ACEPTAR TODO", permites que guardemos tus preferencias de estilo de juego 
          y región para que no tengas que configurarlas cada vez.
        </p>
      </div>

      <div class="cookie-actions">
        <button class="btn-cookie btn-secondary" @click="acceptCookies">SOLO ESENCIALES</button>
        <button class="btn-cookie btn-primary" @click="acceptCookies">ACEPTAR TODO</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const hasAccepted = ref(false);

onMounted(() => {
  const consent = localStorage.getItem('nexus_cookies_accepted');
  
  if (consent === 'true') {
    hasAccepted.value = true;
    router.push('/');
  }
});

const acceptCookies = () => {
  localStorage.setItem('nexus_cookies_accepted', 'true');
  hasAccepted.value = true;
  router.push('/');
};
</script>

<style scoped>
.cookie-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #08090b;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.cookie-card {
  background: #12141a;
  border: 1px solid #17bbba;
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 0 50px rgba(23, 187, 186, 0.2);
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.cookie-header h2 {
  color: #17bbba;
  font-family: 'Arial Black', sans-serif;
  font-size: 20px;
  margin-top: 15px;
  letter-spacing: 1px;
}

.icon-box {
  font-size: 50px;
}

.cookie-body {
  margin: 25px 0;
  color: #ccc;
  line-height: 1.6;
}

.small-text {
  font-size: 13px;
  color: #666;
  margin-top: 15px;
}

.cookie-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.btn-cookie {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
  border: none;
}

.btn-primary {
  background: #17bbba;
  color: white;
}

.btn-primary:hover {
  background: #1ad3d1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(23, 187, 186, 0.4);
}

.btn-secondary {
  background: #1a1d24;
  color: #17bbba;
  border: 1px solid #17bbba;
}

.btn-secondary:hover {
  background: rgba(23, 187, 186, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>