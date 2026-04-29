import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import PopUp from '@/views/PopUp.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game/:slug',
      name: 'game',
      component: GameView,
      props: true // Esto permite que el componente reciba el nombre del juego como variable
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUsView
    },
    {
      path: '/popup',
      name: 'popup',
      component: PopUp
    }  
  ],
})

/**
 * EL GUARDIÁN DE NEXUSMATCH
 * Este bloque de código comprueba si el usuario ha aceptado las cookies
 * antes de permitirle navegar por el resto de la aplicación.
 */
router.beforeEach((to, from, next) => {
  // Comprobamos el valor en el almacenamiento local del navegador
  const hasAcceptedCookies = localStorage.getItem('nexus_cookies_accepted');

  // Lógica de redirección:
  // Si NO ha aceptado las cookies Y NO está ya intentando entrar a la vista del popup...
  if (hasAcceptedCookies !== 'true' && to.name !== 'popup') {
    // ...lo redirigimos forzosamente al PopUp
    next({ name: 'popup' });
  } 
  // En cualquier otro caso (ya aceptó o ya va al popup), lo dejamos pasar
  else {
    next();
  }
});

export default router