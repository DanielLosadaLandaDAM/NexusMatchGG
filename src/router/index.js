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
      props: true // Permite que el componente reciba el nombre del juego como variable
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
  BLOQUE DE COOKIES :V
 */
router.beforeEach((to, from, next) => {
  // Se comprueba valor en local storage
  const cookiesAceptadas = localStorage.getItem('cookies_aceptadas');

  // Si no ha aceptado las cookies Y NO está intentando entrar a la vista del popup
  if (cookiesAceptadas !== 'true' && to.name !== 'popup') {
    // Se le redirige al Popup
    next({ name: 'popup' });
  } 

  else {
    next();
  }
});

export default router