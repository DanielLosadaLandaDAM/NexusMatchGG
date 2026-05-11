<template>
  <div class="about-us-view">
    <div class="div-contenido-cetral">
      <h1 class="titulo-cian">SOBRE NEXUSMATCH.GG</h1>
      <div class="linea-separacion"></div>
      <p class="main-parrafo">
        NexusMatchGG nació de la frustración de jugar con los usuarios aleatorios que los juegos eligen por nosotros y no con gente que comparte nuestros mismos objetivos. <br><br>
        Somos una plataforma que busca que nuestros usuarios conecten entre sí a través de los videojuegos, ayudándoles a encontrar a su compañero de partidas ideal.
      </p>
      
      <div class="div-bloques">
        <div class="bloque">
          <h3>NUESTRA MISIÓN</h3>
          <p>Eliminar el azar del matchmaking y construir equipos basados en la comunicación y el estilo de juego.</p>
        </div>
        <div class="bloque">
          <h3>TECNOLOGÍA DE EMPAREJAMIENTO</h3>
          <p>Analizamos tus datos proporcionados en el perfil para encontrar a tu compañero de partidas ideal.</p>
        </div>
      </div>

      <button @click="volverMain" class="boton-volver-catalogo">
        VOLVER AL CATÁLOGO
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const llamadaRouter = useRouter();

function volverMain() {
  llamadaRouter.push('/');
}
</script>

<style scoped>
.about-us-view {
  background-color: #08090b;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 5%;
}

.div-contenido-cetral {
  max-width: 800px;
  background: #12141a;
  padding: 60px;
  border-radius: 24px;
  border: 1px solid #2a2d35;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.titulo-cian {
  color: #17bbba;
  font-family: 'Arial Black', sans-serif;
  font-size: 3rem;
  margin-bottom: 20px;
}

.linea-separacion {
  height: 4px;
  width: 60px;
  background: #17bbba;
  margin: 0 auto 30px;
}

.main-parrafo {
  color: #ccc;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
}

.div-bloques {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.bloque {
  background: #1a1d24;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
}

.bloque h3 {
  color: #17bbba;
  font-size: 0.9rem;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.bloque p {
  color: #888;
  font-size: 0.9rem;
}

.boton-volver-catalogo {
  background: transparent;
  border: 1px solid #17bbba;
  color: #17bbba;
  padding: 12px 30px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.boton-volver-catalogo:hover {
  background: #17bbba;
  color: white;
}

@media (max-width: 600px) {
  .div-bloques { grid-template-columns: 1fr; }
  .titulo-cian { font-size: 2rem; }
}
</style>