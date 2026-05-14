<template>
  <div class="registerview">
    <div class="div-registro">
      <h2>Crea tu cuenta de jugador</h2>
      
      <form @submit.prevent="registrarUsuario" class="formulario">
        
        <div class="campo-entrada">
          <label>Username</label>
          <input type="text" v-model="datoFormulario.username" placeholder="Tu nombre de usuario" required />
        </div>

        <div class="campo-entrada">
          <label>Contraseña</label>
          <input type="password" v-model="datoFormulario.password" placeholder="••••••••" required />
        </div>

        <div class="campo-entrada">
          <label>Correo electrónico</label>
          <input type="email" v-model="datoFormulario.email" placeholder="ejemplo@correo.com" required />
        </div>

        <div class="campo-entrada">
          <label>Avatar</label>
          <input type="file" @change="subirArchivos" class="entrada-archivo-usuario" accept="image/*" />
        </div>

        <div class="campo-entrada">
          <label>Descripción</label>
          <textarea v-model="datoFormulario.description" placeholder="Cuéntanos un poco sobre ti..." required></textarea>
        </div>

        <div class="campo-entrada">
          <label>País</label>
          <select v-model="datoFormulario.country" required>
            <option value="" disabled selected>Selecciona tu país</option>
            <option v-for="country in listaPaises" :key="country.code" :value="country.code">
              {{ country.emoji }} {{ country.name }}
            </option>
          </select>
        </div>

        <div class="campo-entrada">
          <label>Idiomas (Multiselección)</label>
          <select v-model="datoFormulario.languages" multiple class="selector-multiple" required>
            <option v-for="lang in idiomas" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
          <small>Manten Ctrl / Cmd para seleccionar varios</small>
        </div>

        <div class="campo-entrada">
          <label>Juegos de NexusMatchGG (Multiselección)</label>
          <select v-model="datoFormulario.games" multiple class="selector-multiple" required>
            <option v-for="game in listaJuegos" :key="game.slug" :value="game.slug">
              {{ game.name }}
            </option>
          </select>
          <small>Manten Ctrl / Cmd para seleccionar varios</small>
        </div>

        <div class="campo-entrada">
          <label>Estilo de juego</label>
          <div class="grupo-seleccion-radio">
            <label><input type="radio" value="casual" v-model="datoFormulario.style"> CASUAL</label>
            <label><input type="radio" value="pro" v-model="datoFormulario.style"> COMPETITIVO</label>
          </div>
        </div>

        <button type="submit" class="boton-enviar-registro">GUARDAR PERFIL</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase'; 
import { useRouter } from 'vue-router';
import { userSession } from '../session';

const router = useRouter();

const datoFormulario = ref({
  username: '',
  password: '',
  email: '',
  description: '',
  country: '',
  languages: [],
  games: [],
  style: 'casual'
});

const archivoSeleccionado = ref(null);

// --- LISTA COMPLETA RECUPERADA ---
const listaJuegos = [
  { name: 'League of Legends', slug: 'lol' },
  { name: 'Counter Strike 2', slug: 'cs2' },
  { name: 'Valorant', slug: 'valorant' },
  { name: 'Fortnite', slug: 'fortnite' },
  { name: 'Rocket League', slug: 'rocket-league' },
  { name: 'Overwatch', slug: 'overwatch' },
  { name: 'Minecraft', slug: 'minecraft' },
  { name: 'Warzone', slug: 'warzone' },
  { name: 'Apex Legends', slug: 'apex' },
  { name: 'Marvel Rivals', slug: 'marvel-rivals' },
  { name: 'GTA V Online', slug: 'gta-v' },
  { name: 'Dota 2', slug: 'dota-2' },
  { name: 'PUBG', slug: 'pubg' },
  { name: 'Rust', slug: 'rust' },      
  { name: 'World of Warcraft', slug: 'wow' }
];

// --- LISTA DE IDIOMAS COMPLETA RECUPERADA ---
const idiomas = [
  { name: 'Español', code: 'ES' }, { name: 'Inglés', code: 'EN' }, { name: 'Portugués', code: 'PT' },
  { name: 'Francés', code: 'FR' }, { name: 'Alemán', code: 'DE' }, { name: 'Italiano', code: 'IT' },
  { name: 'Chino', code: 'ZH' }, { name: 'Japonés', code: 'JA' }, { name: 'Ruso', code: 'RU' },
  { name: 'Coreano', code: 'KO' }, { name: 'Árabe', code: 'AR' }, { name: 'Turco', code: 'TR' }
];

const listaPaises = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
    const data = await res.json();
    listaPaises.value = data.map(c => ({
      name: c.name.common,
      code: c.cca2,
      emoji: c.flag
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    listaPaises.value = [{ name: 'España', code: 'ES', emoji: '🇪🇸' }, { name: 'México', code: 'MX', emoji: '🇲🇽' }];
  }
});

const subirArchivos = (e) => {
  archivoSeleccionado.value = e.target.files[0];
};

const registrarUsuario = async () => {
  if (!datoFormulario.value.username || !datoFormulario.value.email || !datoFormulario.value.password) {
    alert("❌ Por favor, rellena todos los campos obligatorios.");
    return;
  }

  try {
    let publicImageUrl = '';

    if (archivoSeleccionado.value) {
      const fileExt = archivoSeleccionado.value.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, archivoSeleccionado.value);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      publicImageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          username: datoFormulario.value.username,
          password: datoFormulario.value.password,
          email: datoFormulario.value.email,
          description: datoFormulario.value.description,
          country: datoFormulario.value.country,
          languages: datoFormulario.value.languages,
          games: datoFormulario.value.games,
          style: datoFormulario.value.style,
          avatar_url: publicImageUrl
        }
      ]).select();

    if (error) {
      if (error.code === '23505') {
        alert(error.message.includes('username') ? "❌ El username ya existe." : "❌ El email ya existe.");
        return;
      }
      throw error;
    }

    userSession.login(data[0]);

    alert("¡Perfil creado con éxito!");
    
    router.push('/').then(() => {
        window.location.reload();
    });
    
  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
};
</script>

<style scoped>
.registerview { display: flex; justify-content: center; padding: 40px 20px; background-color: #08090b; }
.div-registro { width: 100%; max-width: 550px; background: #12141a; padding: 35px; border-radius: 12px; border: 1px solid #2a2d35; color: white; }
h2 { text-align: center; margin-bottom: 30px; color: #17bbba; text-transform: uppercase; letter-spacing: 1px; }
.formulario { display: flex; flex-direction: column; gap: 20px; }
.campo-entrada { display: flex; flex-direction: column; gap: 8px; }
label { font-weight: bold; font-size: 13px; color: #b0b3b8; text-transform: uppercase; }

input, select, textarea {
  padding: 12px; border-radius: 6px; border: 1px solid #333; background: #1a1d24; color: white; font-size: 15px;
  accent-color: #17bbba;
}

.selector-multiple {
  height: 120px;
  scrollbar-width: thin;
  scrollbar-color: #17bbba #1a1d24;
}

.grupo-seleccion-radio {
  display: flex; gap: 20px; background: #1a1d24; padding: 12px; border-radius: 6px; border: 1px solid #333;
}

.grupo-seleccion-radio label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }

.boton-enviar-registro {
  margin-top: 10px; background-color: #17bbba; color: white; padding: 16px; border: none; border-radius: 8px;
  font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s;
}
.boton-enviar-registro:hover { background-color: #129d9c; transform: translateY(-2px); }
small { color: #555; font-size: 11px; }
</style>