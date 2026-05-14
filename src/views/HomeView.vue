<template>
  <div class="home">
    <div class="juegos">
      <div 
        v-for="juego in catalogoVideojuegos" 
        :key="juego.slug" 
        class="tarjeta-juego" 
        @click="irAlJuego(juego.slug)"
      >
        <div class="poster">
          <img :src="juego.image" :alt="juego.name">
          <div class="capa-hover"><span>ENTRAR</span></div>
        </div>
        <h3 class="titulo">{{ juego.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    irAlJuego(slug) {
      this.$router.push({ name: 'game', params: { slug } });
    }
  },
  data() {
    return {
      catalogoVideojuegos: [
        { name: 'League of Legends', slug: 'lol', image: 'https://static-cdn.jtvnw.net/ttv-boxart/21779-285x380.jpg' },
        { name: 'Counter Strike 2', slug: 'cs2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/32399-285x380.jpg' },
        { name: 'Valorant', slug: 'valorant', image: 'https://static-cdn.jtvnw.net/ttv-boxart/516575-285x380.jpg' },
        { name: 'Fortnite', slug: 'fortnite', image: 'https://static-cdn.jtvnw.net/ttv-boxart/33214-285x380.jpg' },
        { name: 'Rocket League', slug: 'rocket-league', image: 'https://static-cdn.jtvnw.net/ttv-boxart/30921-285x380.jpg' },
        { name: 'Overwatch', slug: 'overwatch', image: 'https://static-cdn.jtvnw.net/ttv-boxart/515025-285x380.jpg' },
        { name: 'Minecraft', slug: 'minecraft', image: 'https://static-cdn.jtvnw.net/ttv-boxart/27471-285x380.jpg' },
        { name: 'Warzone', slug: 'warzone', image: 'https://static-cdn.jtvnw.net/ttv-boxart/512710-285x380.jpg' },
        { name: 'Apex Legends', slug: 'apex', image: 'https://static-cdn.jtvnw.net/ttv-boxart/511224-285x380.jpg' },
        { name: 'Marvel Rivals', slug: 'marvel-rivals', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2767030/library_600x900_2x.jpg' },
        { name: 'GTA V Online', slug: 'gta-v', image: 'https://static-cdn.jtvnw.net/ttv-boxart/32982-285x380.jpg' },
        { name: 'Dota 2', slug: 'dota-2', image: 'https://static-cdn.jtvnw.net/ttv-boxart/29595-285x380.jpg' },
        { name: 'PUBG', slug: 'pubg', image: 'https://static-cdn.jtvnw.net/ttv-boxart/493057-285x380.jpg' },
        { name: 'Rust', slug: 'rust', image: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/library_600x900_2x.jpg' },      
        { name: 'World of Warcraft', slug: 'wow', image: 'https://static-cdn.jtvnw.net/ttv-boxart/18122-285x380.jpg' }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  padding: 40px 5%;
}

.juegos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
}

.tarjeta-juego {
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s ease;
}

.tarjeta-juego:hover {
  transform: translateY(-10px);
}

.poster {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.poster img {
  width: 100%;
  display: block;
}

.capa-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(23, 187, 186, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.capa-hover span {
  color: white;
  font-weight: bold;
  border: 2px solid white;
  padding: 10px 20px;
}

.tarjeta-juego:hover .capa-hover {
  opacity: 1;
}

.titulo {
  margin-top: 15px;
  color: white;
  font-size: 18px;
}

@media (max-width: 600px) {
  .juegos {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }
  
  .home {
    padding: 20px;
  }

  .titulo {
    font-size: 14px;
  }
}
</style>