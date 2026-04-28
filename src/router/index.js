import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GameView from '../views/GameView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import AboutUsView from '@/views/AboutUsView.vue'

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
  }  
  ],
})

export default router