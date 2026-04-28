<template>
  <div class="profile-wrapper" v-if="userSession.user">
    <div class="profile-card">
      <h2>Mi Perfil de Jugador</h2>
      
      <div class="edit-form">
        <div class="avatar-section">
          <img 
            :src="userSession.user.avatar_url || 'https://www.gravatar.com/avatar/000?d=mp&f=y'" 
            class="large-avatar" 
          />
          <div class="file-select">
            <label for="avatar-input" class="file-label">Cambiar Avatar</label>
            <input id="avatar-input" type="file" @change="handleFileUpload" accept="image/*" />
          </div>
          <p class="player-id">ID: {{ userSession.user.id.slice(0,8) }}</p>
        </div>

        <div class="field">
          <label>Username</label>
          <input type="text" :value="userSession.user.username" disabled class="disabled-input" />
        </div>

        <div class="field">
          <label>Correo electrónico</label>
          <input type="email" v-model="editData.email" required />
        </div>

        <div class="field">
          <label>País</label>
          <select v-model="editData.country" required>
            <option v-for="c in allCountries" :key="c.code" :value="c.code">
              {{ c.emoji }} {{ c.name }}
            </option>
          </select>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Idiomas</label>
            <select v-model="editData.languages" multiple class="select-multiple" required>
              <option v-for="l in topLanguages" :key="l.code" :value="l.code">{{ l.name }}</option>
            </select>
          </div>
          <div class="field">
            <label>Mis Juegos</label>
            <select v-model="editData.games" multiple class="select-multiple" required>
              <option v-for="g in nexusGames" :key="g.slug" :value="g.slug">{{ g.name }}</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>Descripción</label>
          <textarea v-model="editData.description" rows="3"></textarea>
        </div>

        <div class="field">
          <label>Estilo de Juego</label>
          <select v-model="editData.style">
            <option value="casual">CASUAL</option>
            <option value="pro">COMPETITIVO</option>
          </select>
        </div>

        <div class="password-box">
          <h3>Seguridad y Confirmación</h3>
          
          <div class="field">
            <label>Contraseña Actual (Obligatoria para guardar)</label>
            <input type="password" v-model="passCheck.current" placeholder="••••••••" required />
          </div>

          <div v-if="!isChangingPassword" class="password-toggle">
            <a href="#" @click.prevent="isChangingPassword = true" class="toggle-link">
              ¿Quieres cambiar tu contraseña?
            </a>
          </div>

          <div v-else class="password-fields">
            <div class="field">
              <label>Nueva Contraseña</label>
              <input type="password" v-model="passCheck.new" placeholder="Escribe la nueva clave" />
            </div>
            <div class="field">
              <label>Confirmar Nueva</label>
              <input type="password" v-model="passCheck.confirm" placeholder="Repite la nueva clave" />
            </div>
            <a href="#" @click.prevent="cancelPasswordChange" class="cancel-link">Cancelar cambio</a>
          </div>
        </div>

        <div class="actions">
          <button @click="handleUpdate" class="save-btn" :disabled="loading">
            {{ loading ? 'GUARDANDO...' : 'ACTUALIZAR PERFIL' }}
          </button>
          <button @click="handleLogout" class="logout-btn">CERRAR SESIÓN</button>
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

const router = useRouter();
const loading = ref(false);
const allCountries = ref([]);
const selectedFile = ref(null);
const isChangingPassword = ref(false);

const nexusGames = [
  { name: 'League of Legends', slug: 'lol' }, { name: 'Counter Strike 2', slug: 'cs2' },
  { name: 'Valorant', slug: 'valorant' }, { name: 'Fortnite', slug: 'fortnite' },
  { name: 'Rocket League', slug: 'rocket-league' }, { name: 'Overwatch', slug: 'overwatch' },
  { name: 'Warzone', slug: 'warzone' }, { name: 'Apex Legends', slug: 'apex' },
  { name: 'Marvel Rivals', slug: 'marvel-rivals' }, { name: 'Minecraft', slug: 'minecraft' },
  { name: 'GTA V Online', slug: 'gta-v' }, { name: 'Dota 2', slug: 'dota-2' },
  { name: 'PUBG', slug: 'pubg' }, { name: 'Rust', slug: 'rust' }, { name: 'World of Warcraft', slug: 'wow' }
];

const topLanguages = [
  { name: 'Español', code: 'ES' }, { name: 'Inglés', code: 'EN' }, { name: 'Portugués', code: 'PT' },
  { name: 'Francés', code: 'FR' }, { name: 'Alemán', code: 'DE' }, { name: 'Italiano', code: 'IT' }
];

const editData = ref({
  email: userSession.user?.email || '',
  country: userSession.user?.country || '',
  languages: userSession.user?.languages || [],
  games: userSession.user?.games || [],
  description: userSession.user?.description || '',
  style: userSession.user?.style || 'casual'
});

const passCheck = ref({ current: '', new: '', confirm: '' });

onMounted(async () => {
  if (!userSession.user) { router.push('/login'); return; }
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
  const data = await res.json();
  allCountries.value = data.map(c => ({ name: c.name.common, code: c.cca2, emoji: c.flag })).sort((a,b) => a.name.localeCompare(b.name));
});

const handleFileUpload = (e) => { selectedFile.value = e.target.files[0]; };
const cancelPasswordChange = () => {
  isChangingPassword.value = false;
  passCheck.value.new = '';
  passCheck.value.confirm = '';
};

const handleUpdate = async () => {
  if (passCheck.value.current !== userSession.user.password) {
    alert("❌ La contraseña actual es incorrecta.");
    return;
  }
  if (isChangingPassword.value && (!passCheck.value.new || passCheck.value.new !== passCheck.value.confirm)) {
    alert("❌ Las nuevas contraseñas no coinciden.");
    return;
  }

  loading.value = true;
  try {
    let newAvatarUrl = userSession.user.avatar_url;
    if (selectedFile.value) {
      const fileName = `${userSession.user.id}-${Date.now()}.${selectedFile.value.name.split('.').pop()}`;
      await supabase.storage.from('avatars').upload(fileName, selectedFile.value);
      newAvatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
    }

    const updates = { ...editData.value, avatar_url: newAvatarUrl };
    if (isChangingPassword.value) updates.password = passCheck.value.new;

    const { error } = await supabase.from('profiles').update(updates).eq('id', userSession.user.id);
    if (error) throw error;

    userSession.updateUser(updates);
    alert("✅ Perfil actualizado");
    isChangingPassword.value = false;
    passCheck.value = { current: '', new: '', confirm: '' };
  } catch (e) {
    alert("Error: " + e.message);
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  if (confirm("¿Cerrar sesión?")) {
    userSession.logout();
    router.push('/').then(() => window.location.reload());
  }
};
</script>

<style scoped>
.profile-wrapper { display: flex; justify-content: center; padding: 40px 20px; background: #08090b; min-height: 100vh; }
.profile-card { background: #12141a; padding: 35px; border-radius: 12px; width: 100%; max-width: 650px; color: white; border: 1px solid #2a2d35; }

h2 { color: #17bbba; text-align: center; margin-bottom: 25px; text-transform: uppercase; }

.avatar-section { text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; gap: 15px; }
.large-avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #17bbba; }
.file-label { background: #1a1d24; border: 1px solid #333; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-size: 13px; }
#avatar-input { display: none; }

.edit-form { display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.field-row { display: flex; gap: 20px; }

label { font-weight: bold; font-size: 12px; color: #17bbba; text-transform: uppercase; }
input, textarea, select { padding: 12px; background: #1a1d24; border: 1px solid #333; color: white; border-radius: 6px; font-size: 14px; }
.select-multiple { height: 100px; }
.disabled-input { opacity: 0.5; cursor: not-allowed; }

.password-box { background: rgba(23, 187, 186, 0.03); padding: 20px; border-radius: 8px; border: 1px solid #2a2d35; }
h3 { font-size: 14px; margin-bottom: 15px; color: #17bbba; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 8px; }

.password-toggle { margin-top: 10px; }
.toggle-link { color: #17bbba; text-decoration: none; font-size: 13px; font-weight: bold; }
.toggle-link:hover { text-decoration: underline; }

.password-fields { display: flex; flex-direction: column; gap: 15px; margin-top: 15px; padding-top: 15px; border-top: 1px dashed #333; }
.cancel-link { color: #ff4444; font-size: 12px; text-decoration: none; align-self: flex-start; }

/* BOTONES LADO A LADO */
.actions { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #2a2d35;
}

.save-btn { 
  background: #17bbba; color: white; border: none; padding: 14px 30px; 
  border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s;
  min-width: 200px;
}
.save-btn:hover:not(:disabled) { background: #129d9c; transform: translateY(-2px); }

.logout-btn { 
  background: transparent; color: #ff4444; border: 1px solid #ff4444; 
  padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.logout-btn:hover { background: #ff4444; color: white; }

.player-id { font-family: monospace; color: #444; font-size: 12px; }

@media (max-width: 600px) {
  .field-row, .actions { flex-direction: column; gap: 15px; }
  .save-btn, .logout-btn { width: 100%; }
}
</style>