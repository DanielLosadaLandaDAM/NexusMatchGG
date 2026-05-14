<template>
  <div class="login">
    <div class="div-acceso">
      <h2>Iniciar Sesión</h2>
      <p class="subtitulo-bienvenida">Bienvenido de nuevo</p>

      <form @submit.prevent="iniciarSesion" class="form">
        <div class="datos">
          <label>Nombre de Usuario</label>
          <input 
            type="text" 
            v-model="datosUser.username" 
            placeholder="Tu nombre de usuario" 
            required 
          />
        </div>

        <div class="datos">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="datosUser.password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <button type="submit" class="coton-entrada" :disabled="cargaPeticion">
          {{ cargaPeticion ? 'ENTRANDO...' : 'ENTRAR A NEXUSMATCH GG' }}
        </button>
      </form>

      <div class="footer-registro">
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

const routes = useRouter();
const cargaPeticion = ref(false);

const datosUser = ref({
  username: '',
  password: ''
});

const iniciarSesion = async () => {
  cargaPeticion.value = true;
  try {
    // Se busca el perfil por el nombre de usuario
    const { data: usuarioEncontrado, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', datosUser.value.username)
      .single(); 

    if (error || !usuarioEncontrado) {
      alert("❌ El usuario no existe.");
      return;
    }

    // Se combrueba la contraseña
    if (usuarioEncontrado.password === datosUser.value.password) {
      userSession.login(usuarioEncontrado);
      alert("¡Hola de nuevo, " + usuarioEncontrado.username + "!");
      
      // Se redirige al Home y se actualiza el Header
      routes.push('/').then(() => {
        window.location.reload();
      });
    } else {
      alert("❌ Contraseña incorrecta.");
    }

  } catch (err) {
    alert("Error: " + err.message);
  } finally {
    cargaPeticion.value = false;
  }
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: #08090b;
  min-height: 80vh;
}

.div-acceso {
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

.subtitulo-bienvenida {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.datos {
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

.coton-entrada {
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

.coton-entrada:hover:not(:disabled) {
  background-color: #129d9c;
  transform: translateY(-2px);
}

.coton-entrada:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-registro {
  margin-top: 25px;
  text-align: center;
  font-size: 14px;
  color: #888;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.footer-registro a {
  color: #17bbba;
  text-decoration: none;
  font-weight: bold;
}

.footer-registro a:hover {
  text-decoration: underline;
}
</style>  