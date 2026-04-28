<template>
  <footer class="nexus-footer">
    <div class="footer-content">
      <div class="footer-divider"></div>
      <div class="footer-text-box">
        <p class="copyright">
          <span class="brand">NEXUSMATCH<span class="cyan">GG</span></span> 
          © {{ new Date().getFullYear() }} 
          <span class="sep">|</span> 
          Todos los derechos reservados
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.nexus-footer {
  width: 100%;
  padding: 40px 0 20px;
  background: linear-gradient(to top, #0c0d12 0%, #08090b 100%);
  border-top: 1px solid #1a1d24;
  margin-top: auto; /* Para asegurar que empuje si usas flex en App.vue */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
  text-align: center;
}

.footer-divider {
  height: 2px;
  width: 100px;
  background: #17bbba;
  margin: 0 auto 25px;
  box-shadow: 0 0 15px rgba(23, 187, 186, 0.6);
  border-radius: 2px;
}

.footer-text-box {
  background: rgba(18, 20, 26, 0.5);
  padding: 15px 30px;
  border-radius: 50px;
  display: inline-block;
  border: 1px solid rgba(42, 45, 53, 0.5);
  backdrop-filter: blur(5px);
}

.copyright {
  color: #666;
  font-size: 14px;
  letter-spacing: 1.5px;
  margin: 0;
  font-weight: 500;
}

.brand {
  color: #eee;
  font-weight: 900;
  margin-right: 10px;
  font-family: 'Arial Black', sans-serif;
}

.cyan {
  color: #17bbba;
}

.sep {
  color: #2a2d35;
  margin: 0 10px;
}

/* Efecto hover sutil */
.nexus-footer:hover .footer-divider {
  width: 150px;
  transition: width 0.4s ease;
}

@media (max-width: 600px) {
  .copyright {
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  .footer-text-box {
    padding: 10px 20px;
  }
}
</style>