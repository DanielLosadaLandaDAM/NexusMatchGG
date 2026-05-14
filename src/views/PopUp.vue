<template>
  <div v-if="!cookiesAceptadas" class="cookies-overlay">
    <div class="div-cookies">
      <div class="aviso-privacidad">
        <div class="emoticon">🍪</div>
        <h2>CONFIGURACIÓN DE PRIVACIDAD</h2>
      </div>

      <div class="texto">
        <p>
          En <strong>NexusMatchGG</strong> utilizamos cookies para optimizar tu búsqueda de compañeros, 
          analizar el tráfico y mejorar tu experiencia con nuestra IA de matchmaking.
        </p>
        <p class="texto-pequeno">
          Al hacer clic en "ACEPTAR TODO", permites que guardemos tus preferencias de estilo de juego 
          y región para que no tengas que configurarlas cada vez.
        </p>
      </div>

      <div class="botones">
        <button class="boton-cookies solo-esenciales" @click="consentirCookies">SOLO ESENCIALES</button>
        <button class="boton-cookies aceptar-todo" @click="consentirCookies">ACEPTAR TODO</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const routes = useRouter();
const cookiesAceptadas = ref(false);

onMounted(() => {
  const cookiesAceptadas = localStorage.getItem('cookies_aceptadas');
  
  if (cookiesAceptadas === 'true') {
    cookiesAceptadas.value = true;
    routes.push('/');
  }
});

const consentirCookies = () => {
  localStorage.setItem('cookies_aceptadas', 'true');
  cookiesAceptadas.value = true;
  routes.push('/');
};
</script>

<style scoped>
.cookies-overlay {
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

.div-cookies {
  background: #12141a;
  border: 1px solid #17bbba;
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 0 50px rgba(23, 187, 186, 0.2);
  text-align: center;
  animation: animacionAparicionSuave 0.6s ease-out;
}

.aviso-privacidad h2 {
  color: #17bbba;
  font-family: 'Arial Black', sans-serif;
  font-size: 20px;
  margin-top: 15px;
  letter-spacing: 1px;
}

.emoticon {
  font-size: 50px;
}

.texto {
  margin: 25px 0;
  color: #ccc;
  line-height: 1.6;
}

.texto-pequeno {
  font-size: 13px;
  color: #666;
  margin-top: 15px;
}

.botones {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.boton-cookies {
  flex: 1;
  padding: 15px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
  border: none;
}

.aceptar-todo {
  background: #17bbba;
  color: white;
}

.aceptar-todo:hover {
  background: #1ad3d1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(23, 187, 186, 0.4);
}

.solo-esenciales {
  background: #1a1d24;
  color: #17bbba;
  border: 1px solid #17bbba;
}

.solo-esenciales:hover {
  background: rgba(23, 187, 186, 0.1);
}

@keyframes animacionAparicionSuave {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>