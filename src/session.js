import { reactive } from 'vue';

const savedUser = JSON.parse(localStorage.getItem('nexus_user'));

export const userSession = reactive({
  user: savedUser || null,
  
  login(userData) {
    this.user = userData;
    localStorage.setItem('nexus_user', JSON.stringify(userData));
  },
  
  logout() {
    this.user = null;
    localStorage.removeItem('nexus_user');
  },

  updateUser(newData) {
    this.user = { ...this.user, ...newData };
    localStorage.setItem('nexus_user', JSON.stringify(this.user));
  }
});