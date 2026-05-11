<template>
  <div id="header">
    <div v-if="menuAbierto" class="bloqueo-bakground" @click="menuAbierto = false"></div>

    <transition name="animacion-lateral">
      <nav v-if="menuAbierto" class="panel-nav">
        <div class="logo-lateral">
          <Logo tamanoPersonalizado="22" @click="menuAbierto = false" />
        </div>
        <div class="lista-links-nav">
          <router-link to="/" class="opcion-links-menu" @click="menuAbierto = false">
            INICIO
          </router-link>
          <router-link to="/about" class="opcion-links-menu" @click="menuAbierto = false">
            SOBRE NOSOTROS
          </router-link>
        </div>
      </nav>
    </transition>

    <header class="header-main-nav">
      <div class="div-boton-menu">
        <button 
          class="boton-menu" 
          :class="{ 'boton-activo': menuAbierto }" 
          @click="menuAbierto = !menuAbierto"
        >
          <span class="linea-boton"></span>
          <span class="linea-boton"></span>
          <span class="linea-boton"></span>
        </button>
      </div>

      <div class="div-logo-nexusmatch">
        <Logo />
      </div>

      <div class="div-perfil-user">
        <div v-if="!userSession.user" class="botones-login">
          <router-link to="/login" class="estilo-botones-autenticacion">
            INICIAR SESIÓN
          </router-link>
          <router-link to="/registro" class="estilo-botones-autenticacion">
            CREAR PERFIL
          </router-link>
        </div>

        <router-link v-else to="/profile" class="imagen-perfil">
          <div class="circulo-avatar">
            <img 
              :src="userSession.user.avatar_url || 'https://www.gravatar.com/avatar/000?d=mp&f=y'" 
              class="imagen-default"
            />
          </div>
        </router-link>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { userSession } from '../session';
import Logo from './Logo.vue'; 

const menuAbierto = ref(false);
</script>

<style scoped>
.header-main-nav {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 30px 5%;
  color: white;
  box-sizing: border-box;
  z-index: 100;
}

.div-boton-menu { flex: 1; display: flex; justify-content: flex-start; }

.boton-menu {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  z-index: 1001;
}

.linea-boton {
  display: block;
  width: 30px;
  height: 3px;
  background-color: #17bbba;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.boton-menu.boton-activo .linea-boton:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.boton-menu.boton-activo .linea-boton:nth-child(2) { opacity: 0; }
.boton-menu.boton-activo .linea-boton:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

.div-logo-nexusmatch { flex: 2; display: flex; justify-content: center; }

.div-perfil-user { flex: 1; display: flex; justify-content: flex-end; align-items: center; }

.panel-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  background: #12141a;
  z-index: 1000;
  padding: 120px 30px 40px;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
  border-right: 1px solid #2a2d35;
}

.logo-lateral {
  margin-bottom: 40px;
}

.lista-links-nav { display: flex; flex-direction: column; gap: 20px; }

.opcion-links-menu {
  color: #ccc;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 15px 20px;
  border-radius: 12px;
  background: #1a1d24;
  transition: 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;
}

.opcion-links-menu:hover {
  color: white;
  background: #2a2d35;
  border-left: 4px solid #17bbba;
}

.opcion-links-menu.router-link-active {
  color: #17bbba;
  background: rgba(23, 187, 186, 0.1);
}

.bloqueo-bakground {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.animacion-lateral-enter-active, .animacion-lateral-leave-active { transition: transform 0.4s ease; }
.animacion-lateral-enter-from, .animacion-lateral-leave-to { transform: translateX(-100%); }

.botones-login { display: flex; gap: 15px; align-items: center; }
.estilo-botones-autenticacion {
  background-color: #17bbba;
  color: white;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 13px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(23, 187, 186, 0.3);
}
.estilo-botones-autenticacion:hover { background-color: #129d9c; transform: translateY(-2px); }

.circulo-avatar {
  width: 50px; height: 50px; border-radius: 50%;
  border: 2px solid #17bbba; overflow: hidden;
  transition: 0.3s; background: #1a1d24;
}
.circulo-avatar:hover { transform: scale(1.1); box-shadow: 0 0 15px #17bbba; }
.imagen-default { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 900px) {
  .header-main-nav { padding: 20px; }
  .div-perfil-user { display: none; } 
}
</style>