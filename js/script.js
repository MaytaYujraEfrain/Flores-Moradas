// ====================================================
// FLORES AMARILLAS - LÓGICA E INTERACTIVIDAD
// ====================================================

document.addEventListener('DOMContentLoaded', () => {
  // ====================================================
  // ✨ 1. CANVAS: CIELO ESTRELLADO, ESTRELLAS FUGACES, LUCIÉRNAGAS Y PÉTALOS
  // ====================================================
  const canvas = document.getElementById('star-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Generar estrellas titilantes
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Estrellas fugaces ocasionales
    const shootingStars = [];
    function spawnShootingStar() {
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      const startY = Math.random() * (height * 0.35);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25; // Ángulo diagonal ~45°
      const speed = Math.random() * 9 + 12;
      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        len: Math.random() * 70 + 60,
        life: 1.0,
        decay: Math.random() * 0.018 + 0.012,
      });
    }

    // Lanzar estrellas fugaces periódicamente
    setInterval(() => {
      if (Math.random() < 0.75) {
        spawnShootingStar();
      }
    }, 4000);

    // Generar luciérnagas moradas y lilas brillantes flotantes
    const fireflies = [];
    for (let i = 0; i < 85; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 0.8,
        dx: (Math.random() - 0.5) * 0.7,
        dy: -Math.random() * 0.7 - 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Generar pétalos morados y violetas cayendo suavemente
    const petals = [];
    for (let i = 0; i < 26; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 6 + 5,
        dy: Math.random() * 0.8 + 0.5,
        dx: Math.sin(Math.random() * 2) * 0.5,
        angle: Math.random() * 360,
        spin: (Math.random() - 0.5) * 0.02,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    function renderAnimation() {
      ctx.clearRect(0, 0, width, height);

      // Renderizar estrellas fijas titilantes
      stars.forEach((s) => {
        s.alpha += s.twinkleSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) s.twinkleSpeed *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Renderizar estrellas fugaces
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ctx.save();
        const grad = ctx.createLinearGradient(
          ss.x,
          ss.y,
          ss.x - ss.dx * (ss.len / 16),
          ss.y - ss.dy * (ss.len / 16)
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.life})`);
        grad.addColorStop(0.3, `rgba(224, 170, 255, ${ss.life * 0.8})`);
        grad.addColorStop(1, `rgba(157, 78, 221, 0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#e0aaff';
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - ss.dx * (ss.len / 16),
          ss.y - ss.dy * (ss.len / 16)
        );
        ctx.stroke();

        // Destello en la cabeza de la estrella
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.life})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life -= ss.decay;
        if (ss.life <= 0) {
          shootingStars.splice(i, 1);
        }
      }

      // Renderizar luciérnagas lilas y violetas
      fireflies.forEach((f) => {
        f.alpha += f.pulseSpeed;
        if (f.alpha > 1 || f.alpha < 0.2) f.pulseSpeed *= -1;

        ctx.fillStyle = `rgba(224, 170, 255, ${f.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#c77dff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();

        f.x += f.dx;
        f.y += f.dy;
        if (f.y < -10) f.y = height + 10;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
      });

      // Renderizar pétalos morados flotantes
      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = `rgba(199, 125, 255, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(157, 78, 221, 0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 0.5, p.r, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        p.y += p.dy;
        p.x += Math.sin(p.y * 0.015) * 0.6;
        p.angle += p.spin;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
      });

      requestAnimationFrame(renderAnimation);
    }
    renderAnimation();
  }

  // ====================================================
  // 💜 2. EFECTO DE CORAZONES Y MAGIA AL HACER CLIC / TOUCH
  // ====================================================
  window.addEventListener('pointerdown', (e) => {
    // Evitar generar corazones si se hace clic sobre botones o la carta
    if (e.target.closest('button') || e.target.closest('.letter-modal')) return;

    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.classList.add('click-heart');
      heart.innerHTML = ['💜', '✨', '🪻', '💖', '🔮', '💫'][Math.floor(Math.random() * 6)];
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      heart.style.setProperty('--hx', `${(Math.random() - 0.5) * 60}px`);
      heart.style.animationDelay = `${i * 0.08}s`;
      document.body.appendChild(heart);

      setTimeout(() => heart.remove(), 1500);
    }
  });

  // Estela mágica suave al mover el cursor / dedo
  let lastTrailTime = 0;
  window.addEventListener('pointermove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 90) return; // Limitar frecuencia a ~11 fps
    lastTrailTime = now;

    if (e.target.closest('button') || e.target.closest('.letter-modal')) return;

    const spark = document.createElement('span');
    spark.classList.add('click-heart');
    spark.innerHTML = ['✨', '💫', '✦', '⭐'][Math.floor(Math.random() * 4)];
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    spark.style.fontSize = `${Math.random() * 0.4 + 0.7}rem`;
    spark.style.setProperty('--hx', `${(Math.random() - 0.5) * 30}px`);
    document.body.appendChild(spark);

    setTimeout(() => spark.remove(), 900);
  });

  // ====================================================
  // ====================================================
  // 💌 3. EXPERIENCIA DE SOBRE REAL CON SELLO DE LACRE Y CARTA
  // ====================================================
  const letterOpenBtn = document.getElementById('letterOpenBtn');
  const letterCloseBtn = document.getElementById('letterCloseBtn');
  const putBackBtn = document.getElementById('putBackBtn');
  const letterModal = document.getElementById('letterModal');
  const royalEnvelope = document.getElementById('royalEnvelope');
  const waxSeal = document.getElementById('waxSeal');

  function triggerSealCrackle(x, y) {
    // Partículas de oro y lacre morado al romper el sello
    const symbols = ['✨', '✦', '⭐', '💫', '💜', '👑', '💛', '🌸'];
    const count = 28;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const p = document.createElement('span');
        p.classList.add('click-heart');
        p.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 160 + 50;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--hx', `${Math.cos(angle) * dist}px`);
        p.style.animationDuration = `${Math.random() * 0.6 + 1.2}s`;
        p.style.fontSize = `${Math.random() * 0.8 + 0.9}rem`;
        document.body.appendChild(p);

        setTimeout(() => p.remove(), 1600);
      }, i * 20);
    }
  }

  function triggerLetterSparkles() {
    const symbols = ['💜', '✨', '🪻', '💖', '🔮', '⭐', '💫', '🌸', '💛'];
    const count = 24;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // 1. Destellos y corazones mágicos
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.classList.add('click-heart');
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

        // Dispersión radial desde el centro
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 220 + 90;
        const startX = centerX + (Math.random() - 0.5) * 60;
        const startY = centerY + (Math.random() - 0.5) * 60;

        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        heart.style.setProperty('--hx', `${Math.cos(angle) * distance}px`);
        heart.style.animationDuration = '1.8s';
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1800);
      }, i * 30);
    }

    // 2. Explosión de pétalos 3D
    const petalCount = 18;
    for (let j = 0; j < petalCount; j++) {
      setTimeout(() => {
        const petal = document.createElement('div');
        petal.classList.add('burst-petal');

        const angle = (j / petalCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const dist = Math.random() * 240 + 130;
        const targetX = Math.cos(angle) * dist;
        const targetY = Math.sin(angle) * dist + Math.random() * 90;
        const rot = Math.random() * 360 + 180;

        petal.style.left = `${centerX}px`;
        petal.style.top = `${centerY}px`;
        petal.style.setProperty('--target-x', `${targetX}px`);
        petal.style.setProperty('--target-y', `${targetY}px`);
        petal.style.setProperty('--target-rot', `${rot}deg`);
        petal.style.setProperty('--fly-time', `${Math.random() * 0.8 + 1.8}s`);

        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 2600);
      }, j * 35);
    }
  }

  // Abrir el modal del sobre
  if (letterOpenBtn && letterModal) {
    letterOpenBtn.addEventListener('click', () => {
      letterModal.classList.add('active');
    });
  }

  // Abrir el sobre al tocar el Sello de Lacre
  if (waxSeal && royalEnvelope) {
    waxSeal.addEventListener('click', (e) => {
      const rect = waxSeal.getBoundingClientRect();
      const sealCenterX = rect.left + rect.width / 2;
      const sealCenterY = rect.top + rect.height / 2;

      triggerSealCrackle(sealCenterX, sealCenterY);
      royalEnvelope.classList.add('is-open');

      setTimeout(() => {
        triggerLetterSparkles();
      }, 350);
    });
  }

  function closeAndResetEnvelope() {
    if (!letterModal) return;
    if (royalEnvelope) {
      royalEnvelope.classList.remove('is-open');
    }
    setTimeout(() => {
      letterModal.classList.remove('active');
    }, 400);
  }

  if (letterCloseBtn) {
    letterCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAndResetEnvelope();
    });
  }

  if (putBackBtn) {
    putBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAndResetEnvelope();
    });
  }

  // Cerrar al hacer clic en el fondo oscuro
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        closeAndResetEnvelope();
      }
    });
  }

  // ====================================================
  // 🌺 4. INTERACTIVIDAD TÁCTIL Y HOVER CON LAS FLORES
  // ====================================================
  const bouquet = document.getElementById('flowersBouquet');
  if (bouquet) {
    const flowers = bouquet.querySelectorAll('.flower');
    let lastBadgeTime = 0;

    flowers.forEach((fl) => {
      const triggerFlowerGlow = (e) => {
        const rect = fl.getBoundingClientRect();
        const flowerX = rect.left + rect.width / 2;
        const flowerY = rect.top + rect.height * 0.3;

        // Generar estallido sutil de polen y destellos violetas mágicos (sin texto)
        for (let i = 0; i < 3; i++) {
          const spark = document.createElement('span');
          spark.classList.add('click-heart');
          spark.innerHTML = ['✨', '💜', '🪻', '💫', '🌸', '🔮'][Math.floor(Math.random() * 6)];
          spark.style.left = `${flowerX + (Math.random() - 0.5) * 40}px`;
          spark.style.top = `${flowerY + (Math.random() - 0.5) * 30}px`;
          spark.style.setProperty('--hx', `${(Math.random() - 0.5) * 70}px`);
          spark.style.fontSize = `${Math.random() * 0.5 + 0.8}rem`;
          document.body.appendChild(spark);
          setTimeout(() => spark.remove(), 1400);
        }
      };

      fl.addEventListener('pointerenter', triggerFlowerGlow);
      fl.addEventListener('touchstart', triggerFlowerGlow, { passive: true });
    });
  }

  // ====================================================
  // 🌟 5. EXPERIENCIA SINCRONIZADA (MÚSICA + FLORES JUNTAS)
  // ====================================================
  const introScreen = document.getElementById('introScreen');
  const startBtn = document.getElementById('startBtn');
  const bgMusic = document.getElementById('bgMusic');
  const muteBtn = document.getElementById('muteToggle');
  const muteIcon = document.getElementById('muteIcon');
  let hasStarted = false;
  let userPaused = false;
  let audioCtx = null;

  // Desbloqueador de audio para Android / iOS
  function unlockMobileAudio() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    } catch (e) {
      console.log('AudioContext init:', e);
    }
  }

  function startExperience() {
    if (hasStarted) return;
    hasStarted = true;

    // Desbloquear motor de audio móvil
    unlockMobileAudio();

    // 1. Iniciar la música exactamente al salir las flores
    if (bgMusic) {
      bgMusic.volume = 0.9;

      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (muteIcon) muteIcon.innerText = '🔊';
            if (muteBtn) muteBtn.classList.add('playing');
          })
          .catch((err) => {
            console.log('Audio play primary error:', err);
            // Fallback si el navegador requiere recarga
            bgMusic.src = 'audio/audio actual.mpeg';
            bgMusic.load();
            bgMusic.play()
              .then(() => { 
                if (muteIcon) muteIcon.innerText = '🔊';
                if (muteBtn) muteBtn.classList.add('playing');
              })
              .catch((e) => {
                console.log('Audio fallback 1 error, trying audio2:', e);
                bgMusic.src = 'audio/audio2.mpeg';
                bgMusic.load();
                bgMusic.play().catch((err2) => console.log('Audio fallback 2 error:', err2));
              });
          });
      }

      bgMusic.addEventListener('play', () => {
        if (muteBtn) muteBtn.classList.add('playing');
        if (muteIcon) muteIcon.innerText = '🔊';
      });

      bgMusic.addEventListener('pause', () => {
        if (muteBtn) muteBtn.classList.remove('playing');
        if (muteIcon) muteIcon.innerText = '🔇';
      });
    }

    // 2. Activar las flores y animaciones en este instante exacto
    document.body.classList.remove('not-loaded');

    // 3. Desvanecer la pantalla de bienvenida
    if (introScreen) {
      introScreen.classList.add('fade-out');
      setTimeout(() => introScreen.remove(), 850);
    }

    // 4. Lluvia de destellos dorados iniciales
    if (typeof triggerLetterSparkles === 'function') {
      triggerLetterSparkles();
    }
  }

  // Activar en el primer gesto táctil en Android e iOS (pointerdown, touchstart o click)
  if (startBtn) {
    startBtn.addEventListener('pointerdown', startExperience, { passive: true });
    startBtn.addEventListener('touchstart', startExperience, { passive: true });
    startBtn.addEventListener('click', startExperience);
  }

  if (introScreen) {
    introScreen.addEventListener('pointerdown', startExperience, { passive: true });
    introScreen.addEventListener('touchstart', startExperience, { passive: true });
    introScreen.addEventListener('click', startExperience);
  }

  // También iniciar con tecla Enter o Espacio
  window.addEventListener('keydown', (e) => {
    if (!hasStarted && (e.key === 'Enter' || e.key === ' ')) {
      startExperience();
    }
  });

  // 5. Botón flotante para pausar o reanudar manualmente
  if (muteBtn && bgMusic) {
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      if (bgMusic.paused) {
        userPaused = false;
        unlockMobileAudio();
        bgMusic.play().then(() => {
          if (muteIcon) muteIcon.innerText = '🔊';
          muteBtn.classList.add('playing');
        });
      } else {
        userPaused = true;
        bgMusic.pause();
        if (muteIcon) muteIcon.innerText = '🔇';
        muteBtn.classList.remove('playing');
      }
    });
  }
});
