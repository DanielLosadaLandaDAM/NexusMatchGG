<template>
  <div class="registro-wrapper">
    <div class="registro-container">
      <h2>Crea tu cuenta de jugador</h2>
      
      <form @submit.prevent="handleSubmit" class="registro-form">
        
        <div class="field">
          <label>Username</label>
          <input type="text" v-model="formData.username" placeholder="Tu nombre de usuario" required />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input type="password" v-model="formData.password" placeholder="••••••••" required />
        </div>

        <div class="field">
          <label>Correo electrónico</label>
          <input type="email" v-model="formData.email" placeholder="ejemplo@correo.com" required />
        </div>

        <div class="field">
          <label>Avatar</label>
          <input type="file" @change="handleFileUpload" class="file-input" accept="image/*" />
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea v-model="formData.description" placeholder="Cuéntanos un poco sobre ti..." required></textarea>
        </div>

        <div class="field">
          <label>País</label>
          <select v-model="formData.country" required>
            <option value="" disabled selected>Selecciona tu país</option>
            <option v-for="country in allCountries" :key="country.code" :value="country.code">
              {{ country.emoji }} {{ country.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>Idiomas (Multiselección)</label>
          <select v-model="formData.languages" multiple class="select-multiple" required>
            <option v-for="lang in topLanguages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
          <small>Manten Ctrl / Cmd para seleccionar varios</small>
        </div>

        <div class="field">
          <label>Juegos de NexusMatchGG (Multiselección)</label>
          <select v-model="formData.games" multiple class="select-multiple" required>
            <option v-for="game in nexusGames" :key="game.slug" :value="game.slug">
              {{ game.name }}
            </option>
          </select>
          <small>Manten Ctrl / Cmd para seleccionar varios</small>
        </div>

        <div class="field">
          <label>Estilo de juego</label>
          <div class="radio-group">
            <label><input type="radio" value="casual" v-model="formData.style"> CASUAL</label>
            <label><input type="radio" value="pro" v-model="formData.style"> COMPETITIVO</label>
          </div>
        </div>

        <button type="submit" class="submit-btn">GUARDAR PERFIL</button>
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

const formData = ref({
  username: '',
  password: '',
  email: '',
  description: '',
  country: '',
  languages: [],
  games: [],
  style: 'casual'
});

const selectedFile = ref(null);

// --- LISTA COMPLETA RECUPERADA ---
const nexusGames = [
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
const topLanguages = [
  { name: 'Español', code: 'ES' }, { name: 'Inglés', code: 'EN' }, { name: 'Portugués', code: 'PT' },
  { name: 'Francés', code: 'FR' }, { name: 'Alemán', code: 'DE' }, { name: 'Italiano', code: 'IT' },
  { name: 'Chino', code: 'ZH' }, { name: 'Japonés', code: 'JA' }, { name: 'Ruso', code: 'RU' },
  { name: 'Coreano', code: 'KO' }, { name: 'Árabe', code: 'AR' }, { name: 'Turco', code: 'TR' }
];

const allCountries = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
    const data = await res.json();
    allCountries.value = data.map(c => ({
      name: c.name.common,
      code: c.cca2,
      emoji: c.flag
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    allCountries.value = [{ name: 'España', code: 'ES', emoji: '🇪🇸' }, { name: 'México', code: 'MX', emoji: '🇲🇽' }];
  }
});

const handleFileUpload = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  // Validación extra por si acaso
  if (!formData.value.username || !formData.value.email || !formData.value.password) {
    alert("❌ Por favor, rellena todos los campos obligatorios.");
    return;
  }

  try {
    let publicImageUrl = '';

    if (selectedFile.value) {
      const fileExt = selectedFile.value.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, selectedFile.value);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      publicImageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          username: formData.value.username,
          password: formData.value.password,
          email: formData.value.email,
          description: formData.value.description,
          country: formData.value.country,
          languages: formData.value.languages,
          games: formData.value.games,
          style: formData.value.style,
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

    // Iniciamos sesión automáticamente
    userSession.login(data[0]);

    alert("¡Perfil creado con éxito!");
    
    // Redirigimos y recargamos para asegurar que el Header se actualice
    router.push('/').then(() => {
        window.location.reload();
    });
    
  } catch (error) {
    alert("Error al guardar: " + error.message);
  }
};
</script>

<style scoped>
.registro-wrapper { display: flex; justify-content: center; padding: 40px 20px; background-color: #08090b; }
.registro-container { width: 100%; max-width: 550px; background: #12141a; padding: 35px; border-radius: 12px; border: 1px solid #2a2d35; color: white; }
h2 { text-align: center; margin-bottom: 30px; color: #17bbba; text-transform: uppercase; letter-spacing: 1px; }
.registro-form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
label { font-weight: bold; font-size: 13px; color: #b0b3b8; text-transform: uppercase; }

input, select, textarea {
  padding: 12px; border-radius: 6px; border: 1px solid #333; background: #1a1d24; color: white; font-size: 15px;
  accent-color: #17bbba;
}

.select-multiple {
  height: 120px;
  scrollbar-width: thin;
  scrollbar-color: #17bbba #1a1d24;
}

.radio-group {
  display: flex; gap: 20px; background: #1a1d24; padding: 12px; border-radius: 6px; border: 1px solid #333;
}

.radio-group label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; }

.submit-btn {
  margin-top: 10px; background-color: #17bbba; color: white; padding: 16px; border: none; border-radius: 8px;
  font-weight: bold; text-transform: uppercase; cursor: pointer; transition: 0.3s;
}
.submit-btn:hover { background-color: #129d9c; transform: translateY(-2px); }
small { color: #555; font-size: 11px; }
</style>