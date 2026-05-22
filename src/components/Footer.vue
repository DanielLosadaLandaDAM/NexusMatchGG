<template>
  <footer class="footer-pagina-principal">
    <div class="contenedor-alineado">
      <div class="linea-decorativa"></div>
      <div class="fondo-difuminado-texto">
        <p class="texto-copyright">
          <span class="nombre">NEXUSMATCH<span class="texto-resaltado">GG</span></span> 
          © {{ new Date().getFullYear() }} 
          <span class="separador-vertical">|</span> 
          Todos los derechos reservados
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-pagina-principal {
  width: 100%;
  padding: 40px 0 20px;
  border-top: 1px solid #1a1d24;
  margin-top: auto; 
}

.contenedor-alineado {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  text-align: center;
}

.linea-decorativa {
  height: 2px;
  width: 100px;
  background: #17bbba;
  margin: 0 auto 25px;
  box-shadow: 0 0 15px rgba(23, 187, 186, 0.6);
  border-radius: 2px;
}

.fondo-difuminado-texto {
  background: rgba(18, 20, 26, 0.5);
  padding: 15px 30px;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid rgba(42, 45, 53, 0.5);
  backdrop-filter: blur(5px);
}

.texto-copyright {
  color: #666;
  font-size: 14px;
  letter-spacing: 1.5px;
  margin: 0;
  font-weight: 500;
}

.nombre {
  color: #eee;
  font-weight: 900;
  margin-right: 10px;
  font-family: 'Arial Black', sans-serif;
}

.texto-resaltado {
  color: #17bbba;
}

.separador-vertical {
  color: #2a2d35;
  margin: 0 10px;
}

.seccion-pie-pagina-principal:hover .linea-decorativa-horizontal-cian {
  width: 150px;
  transition: width 0.4s ease;
}


@media (max-width: 600px) {
  .texto-copyright {
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  .fondo-difuminado-texto {
    padding: 10px 20px;
  }
}
</style>