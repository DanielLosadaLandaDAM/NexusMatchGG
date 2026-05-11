<template>
  <div class="gameview" v-if="juegoActual">
    
    <div class="limite-ancho">
      <button @click="$router.push('/')" class="boton-main">← VOLVER AL CATÁLOGO</button>

      <div class="header-info-juego">
        <div class="caja-poster-juego">
          <img :src="juegoActual.image" :alt="juegoActual.name" class="imagen-poster-juego" />
        </div>

        <div class="detalles-juego">
          <h1 class="titulo-juego">{{ juegoActual.name }}</h1>
          
          <div class="datos-info-juego">
            <div class="dato">
              <span class="tipo-dato">LANZAMIENTO</span>
              <span class="valor-dato">{{ juegoActual.release }}</span>
            </div>
            <div class="dato">
              <span class="tipo-dato">GÉNERO</span>
              <span class="valor-dato">{{ juegoActual.genre }}</span>
            </div>
            <div class="dato">
              <span class="tipo-dato">PLATAFORMAS</span>
              <span class="valor-dato">{{ juegoActual.platforms }}</span>
            </div>
          </div>

          <div class="div-encontrar-jugadores">
            <button 
              v-if="userSession.user && !buscandoCompaneros" 
              class="boton-matchaking encontrar-jugadores"
              @click="iniciarMatchmaking"
            >
              ENCONTRAR JUGADORES
            </button>

            <button v-else-if="buscandoCompaneros" class="boton-matchaking busqueda-activa" disabled>
              <span class="animacion-cargando"></span> ANALIZANDO PERFILES...
            </button>

            <button 
              v-else 
              class="boton-matchaking sesion-requerida"
              @click="$router.push('/login')"
            >
              ES NECESARIO INICIAR SESIÓN
            </button>
          </div>
        </div>
      </div>

      <div v-if="resultadoMatchmaking && resultadoMatchmaking !== 'none'" class="div-resultado-matchmaking">
        <h2 class="texto-compañeros-recomendados">COMPAÑEROS RECOMENDADOS POR LA IA</h2>
        
        <div class="tarjetas-jugadores">
          <div v-for="jugador in resultadoMatchmaking" :key="jugador.id" class="tarjeta-individual">
            <div class="porcentaje-afinidad">{{ jugador.matchPercentage }}% Match</div>
            <div class="avatar">
              <img :src="jugador.avatar_url || 'https://www.gravatar.com/avatar/000?d=mp&f=y' + jugador.username" class="imagen-avatar" />
            </div>
            <div class="detalles-jugador">
              <h3 class="username-jugador">{{ jugador.username }}</h3>
              <p class="pais-estilo-juego">{{ jugador.country }} • {{ jugador.style }}</p>
              <div class="div-idiomas">
                <span v-for="idioma in jugador.languages" :key="idioma" class="idioma-jugador">{{ idioma }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="div-iniciar-juego">
          <button class="boton-iniciar-juego" @click="iniciarJuego">
            INICIAR JUEGO
          </button>
        </div>
      </div>

      <div v-if="resultadoMatchmaking === 'none'" class="sin-resultados">
        <p>No se han encontrado otros usuarios registrados para <strong>{{ juegoActual.name }}</strong>.</p>
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

const propsRecibidas = defineProps(['slug']);
const juegoActual = ref(null);
const buscandoCompaneros = ref(false);
const resultadoMatchmaking = ref(null);

const datosVideojuegos = {
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
  juegoActual.value = datosVideojuegos[propsRecibidas.slug] || datosVideojuegos['lol'];
});

/**
 * Se usa 'async' porque debe esperar respuestas de la base de datos externa.
 */
const iniciarMatchmaking = async () => {
  buscandoCompaneros.value = true;
  
  resultadoMatchmaking.value = null;

  try {
    // Se consulta la tabla 'profiles' en Supabase y se descargan todos los registros
    const { data: usuariosSupabase, error } = await supabase.from('profiles').select('*');
    
    // Si devuelve un error, ddetenemos la ejecución 
    if (error) throw error;

    // Se llama al motor de getSmartMatches pasando diferentes datos
    const matchmakingEncontrado = getSmartMatches(userSession.user, usuariosSupabase, propsRecibidas.slug);
    
    // Si la lista está vacía/no existe, 'none'. Si hay éxito, guardamos los perfiles.
    resultadoMatchmaking.value = (!matchmakingEncontrado || matchmakingEncontrado.length === 0) ? 'none' : matchmakingEncontrado;

  } catch (err) {
    // Si ocurre cualquier fallo, se registra en la consola para depuración
    console.error("Error:", error.message);
  } finally {
    // El bloque se ejecuta siempre. Se usa un delay para que la animación de carga sea visible al usuario
    setTimeout(() => { 
      buscandoCompaneros.value = false; 
    }, 1000);
  }
};

const iniciarJuego = () => {
  if (juegoActual.value && juegoActual.value.uri) {
    console.log("Abriendo:", juegoActual.value.name);
    window.location.href = juegoActual.value.uri;
  } else {
    alert("No se ha podido encontrar el lanzador para este juego.");
  }
};
</script>

<style scoped>
.gameview {
  background-color: #08090b;
  min-height: 100vh;
  padding: 60px 5%;
  color: white;
}

.limite-ancho {
  max-width: 900px;
  margin: 0 auto;
}

.boton-main {
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

.boton-main:hover {
  background: #17bbba;
  color: white;
}

.header-info-juego {
  display: flex;
  gap: 50px;
  background: #12141a;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #2a2d35;
  align-items: flex-start;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.caja-poster-juego { flex: 0 0 260px; }
.imagen-poster-juego { width: 100%; border-radius: 12px; border: 1px solid #333; }
.detalles-juego { flex: 1; display: flex; flex-direction: column; gap: 30px; }
.titulo-juego { font-family: 'Arial Black', sans-serif; font-size: 42px; margin: 0; color: #17bbba; text-transform: uppercase; line-height: 1; }

.datos-info-juego { display: flex; flex-direction: column; gap: 20px; }
.dato { display: flex; flex-direction: column; }
.tipo-dato { color: #555; font-weight: bold; font-size: 11px; letter-spacing: 1.5px; margin-bottom: 5px; }
.valor-dato { color: #fff; font-size: 18px; font-weight: bold; }

.boton-matchaking { padding: 20px; font-size: 16px; font-weight: bold; border: none; border-radius: 12px; cursor: pointer; transition: 0.3s; text-transform: uppercase; width: 100%; letter-spacing: 1px; }
.encontrar-jugadores { background-color: #17bbba; color: white; box-shadow: 0 4px 15px rgba(23, 187, 186, 0.3); }
.encontrar-jugadores:hover { background-color: #129d9c; transform: translateY(-3px); }
.busqueda-activa { background-color: #1a1d24; color: #17bbba; border: 1px solid #17bbba; cursor: wait; }
.sesion-requerida { background-color: #1a1d24; color: #555; border: 1px solid #333; }

.div-resultado-matchmaking { margin-top: 60px; animation: animacionDeslizarArriba 0.5s ease-out; }
.texto-compañeros-recomendados { color: #17bbba; font-size: 14px; letter-spacing: 3px; margin-bottom: 30px; text-align: center; }

.tarjetas-jugadores {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}

.tarjeta-individual {
  background: #12141a;
  border: 1px solid #2a2d35;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  position: relative;
  transition: 0.3s;
}

.porcentaje-afinidad {
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

.imagen-avatar { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #17bbba; object-fit: cover; margin-bottom: 15px; }
.username-jugador { font-size: 20px; margin: 0 0 5px 0; }
.pais-estilo-juego { color: #666; font-size: 13px; margin-bottom: 15px; }
.div-idiomas { display: flex; justify-content: center; gap: 5px; flex-wrap: wrap; }
.idioma-jugador { background: #08090b; font-size: 10px; padding: 3px 8px; border-radius: 4px; color: #aaa; }

.div-iniciar-juego {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.boton-iniciar-juego {
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

.boton-iniciar-juego:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 50px rgba(23, 187, 186, 0.7);
  background-color: #1ad3d1;
}

.sin-resultados {
  margin-top: 50px;
  text-align: center;
  color: #666;
  padding: 40px;
  border: 2px dashed #222;
  border-radius: 20px;
}

/* keyframe para la animcion */
@keyframes animacionDeslizarArriba { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 800px) {
  .header-info-juego { flex-direction: column; align-items: center; text-align: center; }
  .caja-poster-juego { width: 220px; }
  .titulo-juego { font-size: 32px; }
  .boton-iniciar-juego { font-size: 20px; padding: 20px 40px; width: 100%; }
}
</style>