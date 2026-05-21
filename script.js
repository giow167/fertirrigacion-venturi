/* =====================================================
   FERTIRRIGACIÓN · INYECTOR VENTURI · UACh
   Lógica de presentación (animaciones, navegación, edición)
   ===================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------
     1. ANIMACIÓN DE APARICIÓN AL HACER SCROLL
        Usa IntersectionObserver para añadir la clase
        ".visible" a cualquier elemento con ".reveal"
        cuando entra en el viewport.
     ----------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Una vez visible, dejar de observar (mejor rendimiento)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12,
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: si no hay IntersectionObserver, mostrar todo de una vez
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* -----------------------------------------------------
     2. BARRA DE PROGRESO DE SCROLL
        Muestra cuánto se ha avanzado en la presentación.
     ----------------------------------------------------- */
  const progressBar = document.getElementById('scrollProgress');

  function updateProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const pct = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* -----------------------------------------------------
     3. ÍNDICE LATERAL (puntos de navegación)
        Resalta el punto correspondiente a la sección visible.
     ----------------------------------------------------- */
  const navDots = document.querySelectorAll('.side-nav .nav-dot');
  const sections = Array.from(document.querySelectorAll('section.slide'));

  function updateActiveDot() {
    // Sección activa = la que ocupa más espacio en el viewport
    const viewportMid = window.scrollY + window.innerHeight / 2;
    let activeId = sections[0]?.id;

    for (const sec of sections) {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (viewportMid >= top && viewportMid < bottom) {
        activeId = sec.id;
        break;
      }
    }

    navDots.forEach((dot) => {
      const href = dot.getAttribute('href') || '';
      const isActive = href === '#' + activeId;
      dot.classList.toggle('active', isActive);
    });
  }

  /* -----------------------------------------------------
     4. THROTTLING DEL SCROLL CON requestAnimationFrame
        Evita ejecutar las funciones en cada evento de scroll.
     ----------------------------------------------------- */
  let scrollTicking = false;

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateActiveDot();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // Estado inicial
  updateProgress();
  updateActiveDot();

  /* -----------------------------------------------------
     5. SCROLL SUAVE PARA ENLACES INTERNOS
        Mejora la experiencia al usar el índice o el CTA.
     ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* -----------------------------------------------------
     6. CAMPOS EDITABLES (Profesor, fecha, integrantes)
        - Limpian el placeholder al recibir foco
        - Restauran el placeholder si el usuario lo deja vacío
        - Persisten lo escrito en localStorage para no
          perderlo al recargar la página durante la exposición
     ----------------------------------------------------- */
  const editableEls = document.querySelectorAll('[contenteditable="true"]');
  const STORAGE_PREFIX = 'venturi-pres:';

  editableEls.forEach((el, idx) => {
    const placeholder = el.dataset.placeholder || el.textContent.trim();
    // Si no tiene data-placeholder, lo creamos desde el contenido inicial
    if (!el.dataset.placeholder) el.dataset.placeholder = placeholder;

    // Clave única por elemento (índice + texto inicial)
    const key = STORAGE_PREFIX + idx + ':' + placeholder.slice(0, 20);

    // Restaurar contenido guardado, si existe
    const saved = localStorage.getItem(key);
    if (saved && saved !== placeholder) {
      el.textContent = saved;
      el.classList.remove('is-placeholder');
    } else {
      el.classList.add('is-placeholder');
    }

    // Al recibir el foco: si solo tiene el placeholder, limpiar
    el.addEventListener('focus', () => {
      if (el.textContent.trim() === placeholder) {
        el.textContent = '';
        el.classList.remove('is-placeholder');
      }
    });

    // Al perder el foco: si está vacío, restaurar el placeholder
    el.addEventListener('blur', () => {
      const value = el.textContent.trim();
      if (value === '' || value === placeholder) {
        el.textContent = placeholder;
        el.classList.add('is-placeholder');
        localStorage.removeItem(key);
      } else {
        el.classList.remove('is-placeholder');
        localStorage.setItem(key, value);
      }
    });

    // Evitar saltos de línea con Enter en campos cortos
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && !ev.shiftKey && el.tagName !== 'LI') {
        ev.preventDefault();
        el.blur();
      }
    });
  });

  /* -----------------------------------------------------
     7. NAVEGACIÓN POR TECLADO (modo proyección)
        - Flechas ↓ / → / PageDown / Espacio  → siguiente
        - Flechas ↑ / ←  / PageUp           → anterior
        - Inicio                            → portada
        - Fin                               → cierre
        Útil al usar la web durante una exposición.
     ----------------------------------------------------- */
  function currentSectionIndex() {
    const mid = window.scrollY + window.innerHeight / 2;
    for (let i = 0; i < sections.length; i++) {
      const top = sections[i].offsetTop;
      const bottom = top + sections[i].offsetHeight;
      if (mid >= top && mid < bottom) return i;
    }
    return 0;
  }

  function goToSection(idx) {
    if (idx < 0 || idx >= sections.length) return;
    sections[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('keydown', (event) => {
    // No interferir cuando el usuario está editando un campo
    const tag = (event.target.tagName || '').toLowerCase();
    if (event.target.isContentEditable || tag === 'input' || tag === 'textarea') return;

    const i = currentSectionIndex();

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
      case ' ': // Barra espaciadora
        event.preventDefault();
        goToSection(i + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        goToSection(i - 1);
        break;
      case 'Home':
        event.preventDefault();
        goToSection(0);
        break;
      case 'End':
        event.preventDefault();
        goToSection(sections.length - 1);
        break;
      default:
        break;
    }
  });

  /* -----------------------------------------------------
     8. AÑO DINÁMICO EN FECHA (si el usuario no la edita)
        Solo se aplica si el campo conserva su placeholder.
     ----------------------------------------------------- */
  const today = new Date();
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const niceDate = `${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;

  document.querySelectorAll('[data-placeholder="[Fecha de exposición]"]').forEach((el) => {
    if (el.textContent.trim() === '[Fecha de exposición]') {
      // Mostramos la fecha actual pero seguimos marcando como placeholder
      // para que sea editable y pueda restaurarse.
      el.dataset.placeholder = niceDate;
      el.textContent = niceDate;
      el.classList.add('is-placeholder');
    }
  });

  /* -----------------------------------------------------
     9. PEQUEÑO LOG INFORMATIVO
        Confirma en la consola que el script cargó.
     ----------------------------------------------------- */
  // eslint-disable-next-line no-console
  console.info(
    '%cFertirrigación · Inyector Venturi',
    'color:#0a7d52;font-weight:600;font-size:13px;',
    '— UACh · Departamento de Irrigación · Termodinámica'
  );
})();
