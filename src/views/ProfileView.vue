<template>
  <div class="perfil" v-if="userSession.user">
    <div class="div-user">
      <h2>Mi Perfil de Jugador</h2>
      
      <div class="form-perfil">
        <div class="div-imagen-perfil">
          <img 
            :src="userSession.user.avatar_url || 'https://www.gravatar.com/avatar/000?d=mp&f=y'" 
            class="imagen" 
          />
          <div class="seleccionar-avatar">
            <label for="entrada-avatar" class="cambiar-avatar">Cambiar Avatar</label>
            <input id="entrada-avatar" type="file" @change="elegirImagen" accept="image/*" />
          </div>
          <p class="id">ID: {{ userSession.user.id.slice(0,8) }}</p>
        </div>

        <div class="div-password">
          <label>Nombre de Usuario</label>
          <input type="text" :value="userSession.user.username" disabled class="entrada-bloqueada" />
        </div>

        <div class="div-password">
          <label>Correo electrónico</label>
          <input type="email" v-model="formularioPerfil.correo" required />
        </div>

        <div class="div-password">
          <label>País</label>
          <select v-model="formularioPerfil.pais" required>
            <option v-for="pais in listaPaises" :key="pais.codigo" :value="pais.codigo">
              {{ pais.emoji }} {{ pais.nombre }}
            </option>
          </select>
        </div>

        <div class="campos-dobles">
          <div class="div-password">
            <label>Idiomas</label>
            <select v-model="formularioPerfil.idiomas" multiple class="seleccion-multiple" required>
              <option v-for="idioma in listaIdiomas" :key="idioma.codigo" :value="idioma.codigo">{{ idioma.nombre }}</option>
            </select>
          </div>
          <div class="div-password">
            <label>Mis Juegos</label>
            <select v-model="formularioPerfil.juegosFavoritos" multiple class="seleccion-multiple" required>
              <option v-for="juego in listaJuegos" :key="juego.slug" :value="juego.slug">{{ juego.nombre }}</option>
            </select>
          </div>
        </div>

        <div class="div-password">
          <label>Descripción</label>
          <textarea v-model="formularioPerfil.biografia" rows="3"></textarea>
        </div>

        <div class="div-password">
          <label>Estilo de Juego</label>
          <select v-model="formularioPerfil.estiloJuego">
            <option value="casual">CASUAL</option>
            <option value="pro">COMPETITIVO</option>
          </select>
        </div>

        <div class="div-seguridad-confirmacion">
          <h3>Seguridad y Confirmación</h3>
          
          <div class="div-password">
            <label>Contraseña Actual (Obligatoria para guardar)</label>
            <input type="password" v-model="verificacionSeguridad.actual" placeholder="••••••••" required />
          </div>

          <div v-if="!cambiapassword" class="enlace-cambio-clave">
            <a href="#" @click.prevent="cambiapassword = true" class="texto-cambio-password">
              ¿Quieres cambiar tu contraseña?
            </a>
          </div>

          <div v-else class="div-nueva-password">
            <div class="div-password">
              <label>Nueva Contraseña</label>
              <input type="password" v-model="verificacionSeguridad.nueva" placeholder="Escribe la nueva clave" />
            </div>
            <div class="div-password">
              <label>Confirmar Nueva</label>
              <input type="password" v-model="verificacionSeguridad.confirmacion" placeholder="Repite la nueva clave" />
            </div>
            <a href="#" @click.prevent="cancelarCambiopassword" class="cancelar-cambio-password">Cancelar cambio</a>
          </div>
        </div>

        <div class="div-actualizar-perfil">
          <button @click="actualizarPerfil" class="boton-guardar-cambios" :disabled="cargando">
            {{ cargando ? 'GUARDANDO...' : 'ACTUALIZAR PERFIL' }}
          </button>
          <button @click="cerrarSesion" class="boton-cerrar-sesion">CERRAR SESIÓN</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userSession } from '../session';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const routes = useRouter();
const cargando = ref(false);
const listaPaises = ref([]);
const imagenUser = ref(null);
const cambiapassword = ref(false);

const listaJuegos = [
  { nombre: 'League of Legends', slug: 'lol' }, { nombre: 'Counter Strike 2', slug: 'cs2' },
  { nombre: 'Valorant', slug: 'valorant' }, { nombre: 'Fortnite', slug: 'fortnite' },
  { nombre: 'Rocket League', slug: 'rocket-league' }, { nombre: 'Overwatch', slug: 'overwatch' },
  { nombre: 'Warzone', slug: 'warzone' }, { nombre: 'Apex Legends', slug: 'apex' },
  { nombre: 'Marvel Rivals', slug: 'marvel-rivals' }, { nombre: 'Minecraft', slug: 'minecraft' },
  { nombre: 'GTA V Online', slug: 'gta-v' }, { nombre: 'Dota 2', slug: 'dota-2' },
  { nombre: 'PUBG', slug: 'pubg' }, { nombre: 'Rust', slug: 'rust' }, { nombre: 'World of Warcraft', slug: 'wow' }
];

const listaIdiomas = [
{ nombre: 'Español', codigo: 'ES' }, { nombre: 'Inglés', codigo: 'EN' }, { nombre: 'Portugués', codigo: 'PT' },
  { nombre: 'Francés', codigo: 'FR' }, { nombre: 'Alemán', codigo: 'DE' }, { nombre: 'Italiano', codigo: 'IT' },
  { nombre: 'Japonés', codigo: 'JA' }, { nombre: 'Coreano', codigo: 'KO' }, { nombre: 'Chino', codigo: 'ZH' },
  { nombre: 'Turco', codigo: 'TR' }, { nombre: 'Ruso', codigo: 'RU' }, { nombre: 'Árabe', codigo: 'AR' }
];

const formularioPerfil = ref({
  correo: userSession.user?.email || '',
  pais: userSession.user?.country || '',
  idiomas: userSession.user?.languages || [],
  juegosFavoritos: userSession.user?.games || [],
  biografia: userSession.user?.description || '',
  estiloJuego: userSession.user?.style || 'casual'
});

const verificacionSeguridad = ref({ actual: '', nueva: '', confirmacion: '' });

onMounted(async () => {
  if (!userSession.user) { routes.push('/login'); return; }
  
  try {
    const respuestaPaises = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
    const datosPaises = await respuestaPaises.json();
    listaPaises.value = datosPaises.map(p => ({ 
      nombre: p.name.common, 
      codigo: p.cca2, 
      emoji: p.flag 
    })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error("Error cargando países:", error);
  }
});

const elegirImagen = (evento) => { 
  imagenUser.value = evento.target.files[0]; 
};

const cancelarCambiopassword = () => {
  cambiapassword.value = false;
  verificacionSeguridad.value.nueva = '';
  verificacionSeguridad.value.confirmacion = '';
};

const actualizarPerfil = async () => {
  // Compara la contraseña que el usuario escribió en el campo actual
  if (verificacionSeguridad.value.actual !== userSession.user.password) {
    alert("❌ La contraseña actual es incorrecta.");
    return; 
  }
  // Comprueba: 
  // Que la nueva contraseña no esté vacía
  // Que la nueva contraseña y la de confirmación sean idénticas
  if (cambiapassword.value && (!verificacionSeguridad.value.nueva || verificacionSeguridad.value.nueva !== verificacionSeguridad.value.confirmacion)) {
    alert("❌ Las nuevas contraseñas no coinciden.");
    return; 
  }

// Se actva el estado de carga para bloquear botones y mostrar que la web está pensando
  cargando.value = true;
  
  try {
    // Se mantiene la URL del avatar que ya tiene el usuario
    let avatarActualizado = userSession.user.avatar_url;

    // Si el usuario ha seleccionado un archivo nuevo en el input 
    if (imagenUser.value) {
      // Se crea un nombre de archivo único: ID + tiempo + extensión original
      const nombreArchivo = `${userSession.user.id}-${Date.now()}.${imagenUser.value.name.split('.').pop()}`;
      
      // Se sube el archivo físico en Supabase Storage
      await supabase.storage.from('avatars').upload(nombreArchivo, imagenUser.value);
      
      // Se pide la URL pública de ese archivo para guardarla en el perfil
      avatarActualizado = supabase.storage.from('avatars').getPublicUrl(nombreArchivo).data.publicUrl;
    }
    
    const nuevosDatos = { 
      email: formularioPerfil.value.correo,
      country: formularioPerfil.value.pais,
      languages: formularioPerfil.value.idiomas,
      games: formularioPerfil.value.juegosFavoritos,
      description: formularioPerfil.value.biografia,
      style: formularioPerfil.value.estiloJuego,
      avatar_url: avatarActualizado 
    };

    // Si el usuario quiere cambiar contraseña se añade la nueva clave al objeto que va a la base de datos.
    if (cambiapassword.value) nuevosDatos.password = verificacionSeguridad.value.nueva;

    // Se le dice a Supabase que actualice la tabla 'profiles'
    const { error } = await supabase.from('profiles').update(nuevosDatos).eq('id', userSession.user.id);
    
    if (error) throw error;

    // Actualización de los datos 
    userSession.updateUser(nuevosDatos);
    
    // Se vacían los inputs
    alert("✅ Perfil actualizado correctamente");
    cambiapassword.value = false;
    verificacionSeguridad.value = { actual: '', nueva: '', confirmacion: '' };
    
  } catch (err) {
    alert("Error al actualizar: " + err.message);
  } finally {
    // Pase lo que pase se quita el estado de carga 
    cargando.value = false;
  }
};

const cerrarSesion = () => {
  if (confirm("¿Seguro que quieres cerrar la sesión?")) {
    userSession.logout();
    routes.push('/').then(() => window.location.reload());
  }
};
</script>

<style scoped>
.perfil { display: flex; justify-content: center; padding: 40px 20px; background: #08090b; min-height: 100vh; }
.div-user { background: #12141a; padding: 35px; border-radius: 12px; width: 100%; max-width: 650px; color: white; border: 1px solid #2a2d35; }

h2 { color: #17bbba; text-align: center; margin-bottom: 25px; text-transform: uppercase; }

.div-imagen-perfil { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
.imagen { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #17bbba; }
.cambiar-avatar { background: #1a1d24; border: 1px solid #333; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 13px; }
#entrada-avatar { display: none; }

.form-perfil { display: flex; flex-direction: column; gap: 20px; }
.div-password { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.campos-dobles { display: flex; gap: 20px; }

label { font-weight: bold; font-size: 12px; color: #17bbba; text-transform: uppercase; }
input, textarea, select { padding: 12px; background: #1a1d24; border: 1px solid #333; color: white; border-radius: 6px; font-size: 14px; }
.seleccion-multiple { height: 100px; }
.entrada-bloqueada { opacity: 0.5; cursor: not-allowed; }

.div-seguridad-confirmacion { background: rgba(23, 187, 186, 0.03); padding: 20px; border-radius: 8px; border: 1px solid #2a2d35; }
h3 { font-size: 14px; margin-bottom: 15px; color: #17bbba; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 8px; }

.enlace-cambio-clave { margin-top: 10px; }
.texto-cambio-password { color: #17bbba; text-decoration: none; font-size: 13px; font-weight: bold; }
.texto-cambio-password:hover { text-decoration: underline; }

.div-nueva-password { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #333; }
.cancelar-cambio-password { color: #ff4444; font-size: 12px; text-decoration: none; align-self: flex-start; }

.div-actualizar-perfil { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #2a2d35;
}

.boton-guardar-cambios { 
  background: #17bbba; color: white; border: none; padding: 14px 30px; 
  border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s;
  min-width: 200px;
}
.boton-guardar-cambios:hover:not(:disabled) { background: #129d9c; transform: translateY(-2px); }

.boton-cerrar-sesion { 
  background: transparent; color: #ff4444; border: 1px solid #ff4444; 
  padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.boton-cerrar-sesion:hover { background: #ff4444; color: white; }

.id { font-family: monospace; color: #444; font-size: 12px; }

@media (max-width: 600px) {
  .campos-dobles, .div-actualizar-perfil { flex-direction: column; gap: 15px; }
  .boton-guardar-cambios, .boton-cerrar-sesion { width: 100%; }
}
</style>