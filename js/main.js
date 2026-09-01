/* ==========================================================================
   main.js — Isabella Lopera Ayala Portfolio
   Vanilla JS: Navigation, scroll effects, animations, form handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ────────────────────────────────────────────────
  // Mobile Menu
  // ────────────────────────────────────────────────
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');

  menuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.querySelector('i').className = isOpen ? 'ri-close-line' : 'ri-menu-3-line';
  });

  // Close mobile menu when clicking a link
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.querySelector('i').className = 'ri-menu-3-line';
      }
    });
  });


  // ────────────────────────────────────────────────
  // Navbar scroll effect
  // ────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Navbar background
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 50);
    }

    // Scroll progress bar
    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }

    // Back-to-top button
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollTop > 500);
    }

    // Active nav link
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ────────────────────────────────────────────────
  // Active nav link tracking
  // ────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 150;
    let currentId = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinksAll.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }


  // ────────────────────────────────────────────────
  // Scroll reveal animations (Intersection Observer)
  // ────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }




  // ────────────────────────────────────────────────
  // Particle effect on hero canvas
  // ────────────────────────────────────────────────
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 138, 192, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 138, 192, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    // Only run particles on larger screens
    const mq = window.matchMedia('(min-width: 768px)');
    function handleParticles(e) {
      if (e.matches) {
        resizeCanvas();
        createParticles();
        drawParticles();
      } else {
        cancelAnimationFrame(animationId);
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    mq.addEventListener('change', handleParticles);
    handleParticles(mq);

    window.addEventListener('resize', () => {
      if (mq.matches) {
        cancelAnimationFrame(animationId);
        resizeCanvas();
        createParticles();
        drawParticles();
      }
    });
  }


  // ────────────────────────────────────────────────
  // Custom cursor (desktop only)
  // ────────────────────────────────────────────────
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      cursorDot.style.transform = 'translate(-50%, -50%)';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      cursorRing.style.transform = 'translate(-50%, -50%)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  // ────────────────────────────────────────────────
  // Dynamic year in footer
  // ────────────────────────────────────────────────
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // ────────────────────────────────────────────────
  // Smooth scroll for anchor links (polyfill-safe)
  // ────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ────────────────────────────────────────────────
  // Lightbox (WhatsApp-style photo viewer)
  // ────────────────────────────────────────────────
  const lightbox       = document.getElementById('lightbox');
  const lightboxClose  = document.getElementById('lightbox-close');
  const lightboxBack   = document.getElementById('lightbox-backdrop');

  function openLightbox() {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Triggers: about img
  const aboutAvatar = document.getElementById('about-avatar-img');
  aboutAvatar?.addEventListener('click', openLightbox);
  aboutAvatar?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
  });

  // Close handlers
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBack?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

});
