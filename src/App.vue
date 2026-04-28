<template>
  <div id="app">
    <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>

    <transition name="slide-menu">
      <nav v-if="isMenuOpen" class="side-menu">
        <div class="side-menu-header">
          <h2 class="menu-title">NEXUSMATCH<span class="cyan">GG</span></h2>
        </div>
        <div class="menu-links">
          <router-link to="/" class="menu-item" @click="isMenuOpen = false">
             INICIO
          </router-link>
          <router-link to="/about" class="menu-item" @click="isMenuOpen = false">
             SOBRE NOSOTROS
          </router-link>
        </div>
      </nav>
    </transition>

    <header class="main-header">
      <div class="menu-section">
        <button 
          class="hamburger-btn" 
          :class="{ 'is-active': isMenuOpen }" 
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="line"></span>
          <span class="line"></span>
          <span class="line"></span>
        </button>
      </div>

      <div class="brand-section" @click="$router.push('/')" style="cursor:pointer">
        <h1 class="logo">
          NEXUSMATCH <span class="gg-text">GG</span>
        </h1>
      </div>

      <div class="action-section">
        <div v-if="!userSession.user" class="auth-buttons">
          <router-link to="/login" class="btn-auth">
            INICIAR SESIÓN
          </router-link>
          <router-link to="/registro" class="btn-auth">
            CREAR PERFIL
          </router-link>
        </div>

        <router-link v-else to="/profile" class="avatar-link">
          <div class="avatar-circle">
            <img 
              :src="userSession.user.avatar_url || 'https://www.gravatar.com/avatar/000?d=mp&f=y'" 
              class="nav-avatar"
            />
          </div>
        </router-link>
      </div>
    </header>


    <router-view />
  </div>
  
  <Footer></Footer>

</template>

<script setup>
import { ref } from 'vue';
import { userSession } from './session';
import Footer from './components/Footer.vue';


const isMenuOpen = ref(false);
</script>

<style>
@import './assets/styles.css';

/* ESTRUCTURA GENERAL DEL HEADER */
.main-header {
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

/* SECCIÓN MENÚ (IZQUIERDA) */
.menu-section {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

/* BOTÓN HAMBURGUESA */
.hamburger-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  z-index: 1001;
}

.line {
  display: block;
  width: 30px;
  height: 3px;
  background-color: #17bbba;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Animación a 'X' */
.hamburger-btn.is-active .line:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger-btn.is-active .line:nth-child(2) { opacity: 0; }
.hamburger-btn.is-active .line:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* LOGO (CENTRO) */
.brand-section { 
  flex: 2; 
  display: flex; 
  justify-content: center; 
}

.logo { 
  font-family: 'Arial Black', sans-serif; 
  font-size: 38px; 
  margin: 0; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.logo .gg-text { 
  color: #17bbba; 
  text-shadow: 0 0 10px rgba(23, 187, 186, 0.5); 
}

/* ACCIONES (DERECHA) */
.action-section { 
  flex: 1; 
  display: flex; 
  justify-content: flex-end; 
  align-items: center; 
}

/* MENÚ LATERAL DESPLEGABLE */
.side-menu {
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

.menu-title {
  font-family: 'Arial Black', sans-serif;
  font-size: 20px;
  color: white;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.menu-title .cyan { color: #17bbba; }

.menu-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-item {
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

.menu-item:hover {
  color: white;
  background: #2a2d35;
  border-left: 4px solid #17bbba;
}

.menu-item.router-link-active {
  color: #17bbba;
  background: rgba(23, 187, 186, 0.1);
}

/* OVERLAY */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* ANIMACIÓN SLIDE */
.slide-menu-enter-active, .slide-menu-leave-active { transition: transform 0.4s ease; }
.slide-menu-enter-from, .slide-menu-leave-to { transform: translateX(-100%); }

/* ESTILOS ORIGINALES DE BOTONES Y AVATAR */
.auth-buttons { display: flex; gap: 15px; align-items: center; }
.btn-auth {
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
.btn-auth:hover {
  background-color: #129d9c;
  transform: translateY(-2px);
}
.avatar-circle {
  width: 50px; height: 50px; border-radius: 50%;
  border: 2px solid #17bbba; overflow: hidden;
  transition: 0.3s; background: #1a1d24;
}
.avatar-circle:hover { transform: scale(1.1); box-shadow: 0 0 15px #17bbba; }
.nav-avatar { width: 100%; height: 100%; object-fit: cover; }

/* RESPONSIVO */
@media (max-width: 900px) {
  .main-header { padding: 20px; }
  .logo { font-size: 24px; }
  .action-section { display: none; } 
}
</style>