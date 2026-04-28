<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <p class="subtitle">Bienvenido de nuevo, jugador.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>Username</label>
          <input 
            type="text" 
            v-model="loginData.username" 
            placeholder="Tu nombre de usuario" 
            required 
          />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="loginData.password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'ENTRANDO...' : 'ENTRAR A NEXUSMATCH GG' }}
        </button>
      </form>

      <div class="login-footer">
        <span>¿No tienes cuenta?</span>
        <router-link to="/registro">Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../supabase';
import { userSession } from '../session';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);

const loginData = ref({
  username: '',
  password: ''
});

const handleLogin = async () => {
  loading.value = true;
  try {
    // 1. Buscamos el perfil por username
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', loginData.value.username)
      .single(); // Esperamos solo un resultado

    if (error || !data) {
      alert("❌ El usuario no existe.");
      return;
    }

    // 2. Comprobamos la contraseña (texto plano por ser proyecto de clase)
    if (data.password === loginData.value.password) {
      // ÉXITO: Guardamos en sesión
      userSession.login(data);
      alert("✅ ¡Hola de nuevo, " + data.username + "!");
      
      // Redirigimos al Home y recargamos para actualizar el Header
      router.push('/').then(() => {
        window.location.reload();
      });
    } else {
      alert("❌ Contraseña incorrecta.");
    }

  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: #08090b;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #12141a;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #2a2d35;
  color: white;
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}

h2 { 
  text-align: center; 
  margin-bottom: 10px; 
  color: #17bbba; 
  text-transform: uppercase; 
  letter-spacing: 1px;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: bold;
  font-size: 12px;
  color: #17bbba;
  text-transform: uppercase;
}

input {
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1a1d24;
  color: white;
  font-size: 15px;
  transition: 0.3s;
}

input:focus {
  border-color: #17bbba;
  outline: none;
  box-shadow: 0 0 8px rgba(23, 187, 186, 0.2);
}

.login-btn {
  margin-top: 10px;
  background-color: #17bbba;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover:not(:disabled) {
  background-color: #129d9c;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #888;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.login-footer a {
  color: #17bbba;
  text-decoration: none;
  font-weight: bold;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>