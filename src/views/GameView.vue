<template>
  <div class="game-view-wrapper" v-if="currentGame">
    
    <div class="container">
      <button @click="$router.push('/')" class="btn-back">← VOLVER AL CATÁLOGO</button>

      <div class="game-header-card">
        <div class="game-poster-box">
          <img :src="currentGame.image" :alt="currentGame.name" class="game-img" />
        </div>

        <div class="game-details-box">
          <h1 class="game-title">{{ currentGame.name }}</h1>
          
          <div class="info-list">
            <div class="info-row">
              <span class="label">LANZAMIENTO</span>
              <span class="value">{{ currentGame.release }}</span>
            </div>
            <div class="info-row">
              <span class="label">GÉNERO</span>
              <span class="value">{{ currentGame.genre }}</span>
            </div>
            <div class="info-row">
              <span class="label">PLATAFORMAS</span>
              <span class="value">{{ currentGame.platforms }}</span>
            </div>
          </div>

          <div class="action-area">
            <button 
              v-if="userSession.user && !isSearching" 
              class="btn-match btn-cyan"
              @click="handleMatchmaking"
            >
              ENCONTRAR JUGADORES
            </button>

            <button v-else-if="isSearching" class="btn-match btn-searching" disabled>
              <span class="spinner"></span> ANALIZANDO PERFILES...
            </button>

            <button 
              v-else 
              class="btn-match btn-locked"
              @click="$router.push('/login')"
            >
              ES NECESARIO INICIAR SESIÓN
            </button>
          </div>
        </div>
      </div>

      <div v-if="matchResults && matchResults !== 'none'" class="results-wrapper">
        <h2 class="results-header">COMPAÑEROS RECOMENDADOS POR LA IA</h2>
        
        <div class="players-grid">
          <div v-for="player in matchResults" :key="player.id" class="player-card">
            <div class="affinity-tag">{{ player.matchPercentage }}% Match</div>
            <div class="player-avatar-box">
              <img :src="player.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + player.username" class="player-avatar" />
            </div>
            <div class="player-body">
              <h3 class="player-username">{{ player.username }}</h3>
              <p class="player-subline">{{ player.country }} • {{ player.style }}</p>
              <div class="player-langs">
                <span v-for="lang in player.languages" :key="lang" class="lang-badge">{{ lang }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="final-action-container">
          <button class="btn-start-game" @click="handleLaunchGame">
            INICIAR JUEGO
          </button>
        </div>
      </div>

      <div v-if="matchResults === 'none'" class="no-results-box">
        <p>No se han encontrado otros usuarios registrados para <strong>{{ currentGame.name }}</strong>.</p>
        <p style="font-size: 12px; color: #444; margin-top: 10px;">Prueba a cambiar tu estilo en el perfil para ver otros resultados.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userSession } from '../session';
import { supabase } from '../supabase'; 
import { getSmartMatches } from '../matchmakingEngine';

const props = defineProps(['slug']);
const currentGame = ref(null);
const isSearching = ref(false);
const matchResults = ref(null);

// Base de datos actualizada con los URIs de lanzamiento
const gamesDatabase = {
  'lol': { 
    name: 'League of Legends', 
    uri: 'riotclient://launch-product=league_of_legends&patchline=live',
    release: '2009', genre: 'MOBA', platforms: 'PC', image: 'https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg' 
  },
  'cs2': { 
    name: 'Counter Strike 2', 
    uri: 'steam://run/730',
    release: '2023', genre: 'FPS', platforms: 'PC', image: 'https://static-cdn.jtvnw.net/ttv-boxart/32399-285x380.jpg' 
  },
  'valorant': { 
    name: 'Valorant', 
    uri: 'riotclient://launch-product=valorant&patchline=live',
    release: '2020', genre: 'Tactical Shooter', platforms: 'PC, PS5, Xbox Series X', image: 'https://static-cdn.jtvnw.net/ttv-boxart/516575-285x380.jpg' 
  },
  'fortnite': { 
    name: 'Fortnite', 
    uri: 'com.epicgames.launcher://apps/Fortnite?action=launch&silent=true',
    release: '2017', genre: 'Battle Royale', platforms: 'PC, PS5, Xbox Series X, Switch 2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg' 
  },
  'rocket-league': { 
    name: 'Rocket League', 
    uri: 'steam://run/252950',
    release: '2015', genre: 'Sports', platforms: 'PC, PS5, Xbox Series X, Switch 2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/30921-285x380.jpg' 
  },
  'overwatch': { 
    name: 'Overwatch', 
    uri: 'battlenet://Pro',
    release: '2022', genre: 'Hero Shooter', platforms: 'PC, PS5, Xbox Series X, Switch 2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/515025-285x380.jpg' 
  },
  'minecraft': { 
    name: 'Minecraft', 
    uri: 'minecraft://',
    release: '2011', genre: 'Sandbox', platforms: 'PC, PS5, Xbox Series X, Switch 2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/27471-285x380.jpg' 
  },
  'warzone': { 
    name: 'Warzone', 
    uri: 'battlenet://WLBY',
    release: '2020', genre: 'Battle Royale', platforms: 'PC, PS5, Xbox Series X', image: 'https://static-cdn.jtvnw.net/ttv-boxart/512710-285x380.jpg' 
  },
  'apex': { 
    name: 'Apex Legends', 
    uri: 'steam://run/1172470',
    release: '2019', genre: 'Battle Royale', platforms: 'PC, PS5, Xbox Series X, Switch 2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/511224-285x380.jpg' 
  },
  'marvel-rivals': { 
    name: 'Marvel Rivals', 
    uri: 'steam://run/2767030',
    release: '2024', genre: 'Hero Shooter', platforms: 'PC, PS5, Xbox Series X', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/library_600x900_2x.jpg' 
  },
  'gta-v': { 
    name: 'GTA V Online', 
    uri: 'steam://run/271590',
    release: '2013', genre: 'Action', platforms: 'PC, PS5, Xbox Series X', image: 'https://static-cdn.jtvnw.net/ttv-boxart/32982-285x380.jpg' 
  },
  'dota-2': { 
    name: 'Dota 2', 
    uri: 'steam://run/570',
    release: '2013', genre: 'MOBA', platforms: 'PC', image: 'https://static-cdn.jtvnw.net/ttv-boxart/29595-285x380.jpg' 
  },
  'pubg': { 
    name: 'PUBG', 
    uri: 'steam://run/578080',
    release: '2017', genre: 'Battle Royale', platforms: 'PC, PS5, Xbox Series X', image: 'https://static-cdn.jtvnw.net/ttv-boxart/493057-285x380.jpg' 
  },
  'rust': { 
    name: 'Rust', 
    uri: 'steam://run/252490',
    release: '2013', genre: 'Survival', platforms: 'PC, PS5, Xbox Series X', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/library_600x900_2x.jpg' 
  },
  'wow': { 
    name: 'World of Warcraft', 
    uri: 'battlenet://WoW',
    release: '2004', genre: 'MMORPG', platforms: 'PC', image: 'https://static-cdn.jtvnw.net/ttv-boxart/18122-285x380.jpg' 
  }
};

onMounted(() => {
  currentGame.value = gamesDatabase[props.slug] || gamesDatabase['lol'];
});

const handleMatchmaking = async () => {
  isSearching.value = true;
  matchResults.value = null;

  try {
    const { data: dbUsers, error } = await supabase.from('profiles').select('*');
    if (error) throw error;

    const matches = getSmartMatches(userSession.user, dbUsers, props.slug);
    matchResults.value = (!matches || matches.length === 0) ? 'none' : matches;

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    setTimeout(() => { isSearching.value = false; }, 1000);
  }
};

const handleLaunchGame = () => {
  if (currentGame.value && currentGame.value.uri) {
    console.log("Abriendo:", currentGame.value.name);
    // Esta es la línea que abre el juego en el PC del usuario
    window.location.href = currentGame.value.uri;
  } else {
    alert("No se ha podido encontrar el lanzador para este juego.");
  }
};
</script>

<style scoped>
.game-view-wrapper {
  background-color: #08090b;
  min-height: 100vh;
  padding: 60px 5%;
  color: white;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.btn-back {
  background: transparent;
  border: 1px solid #17bbba;
  color: #17bbba;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 40px;
  transition: 0.3s;
}

.btn-back:hover {
  background: #17bbba;
  color: white;
}

.game-header-card {
  display: flex;
  gap: 50px;
  background: #12141a;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #2a2d35;
  align-items: flex-start;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.game-poster-box { flex: 0 0 260px; }
.game-img { width: 100%; border-radius: 12px; border: 1px solid #333; }
.game-details-box { flex: 1; display: flex; flex-direction: column; gap: 30px; }
.game-title { font-family: 'Arial Black', sans-serif; font-size: 42px; margin: 0; color: #17bbba; text-transform: uppercase; line-height: 1; }

.info-list { display: flex; flex-direction: column; gap: 20px; }
.info-row { display: flex; flex-direction: column; }
.label { color: #555; font-weight: bold; font-size: 11px; letter-spacing: 1.5px; margin-bottom: 5px; }
.value { color: #fff; font-size: 18px; font-weight: bold; }

.btn-match { padding: 20px; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s; text-transform: uppercase; width: 100%; letter-spacing: 1px; }
.btn-cyan { background-color: #17bbba; color: white; box-shadow: 0 4px 15px rgba(23, 187, 186, 0.3); }
.btn-cyan:hover { background-color: #129d9c; transform: translateY(-3px); }
.btn-searching { background-color: #1a1d24; color: #17bbba; border: 1px solid #17bbba; cursor: wait; }
.btn-locked { background-color: #1a1d24; color: #555; border: 1px solid #333; }

.results-wrapper { margin-top: 60px; animation: slideUp 0.5s ease-out; }
.results-header { color: #17bbba; font-size: 14px; letter-spacing: 3px; margin-bottom: 30px; text-align: center; }

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.player-card {
  background: #12141a;
  border: 1px solid #2a2d35;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  position: relative;
  transition: 0.3s;
}

.affinity-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 11px;
  font-weight: bold;
  color: #17bbba;
  background: rgba(23, 187, 186, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.player-avatar { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #17bbba; object-fit: cover; margin-bottom: 15px; }
.player-username { font-size: 20px; margin: 0 0 5px 0; }
.player-subline { color: #666; font-size: 13px; margin-bottom: 15px; }
.player-langs { display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; }
.lang-badge { background: #08090b; font-size: 10px; padding: 3px 8px; border-radius: 4px; color: #aaa; }

.final-action-container {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.btn-start-game {
  background: #17bbba;
  color: white;
  font-family: 'Arial Black', sans-serif;
  font-size: 28px;
  padding: 25px 80px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(23, 187, 186, 0.4);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.btn-start-game:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 50px rgba(23, 187, 186, 0.7);
  background-color: #1ad3d1;
}

.no-results-box {
  margin-top: 50px;
  text-align: center;
  color: #666;
  padding: 40px;
  border: 2px dashed #222;
  border-radius: 20px;
}

@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 800px) {
  .game-header-card { flex-direction: column; align-items: center; text-align: center; }
  .game-poster-box { width: 220px; }
  .game-title { font-size: 32px; }
  .btn-start-game { font-size: 20px; padding: 20px 40px; width: 100%; }
}
</style>