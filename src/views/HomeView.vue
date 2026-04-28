<template>
  <div class="home">
    <div class="games-grid">
      <div v-for="game in games" :key="game.slug" class="game-card" @click="goToGame(game.slug)">
        <div class="poster-wrapper">
          <img :src="game.image" :alt="game.name">
          <div class="overlay"><span>ENTRAR</span></div>
        </div>
        <h3>{{ game.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToGame(slug) {
      this.$router.push({ name: 'game', params: { slug } });
    }
  },
data() {
  return {
    games: [
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