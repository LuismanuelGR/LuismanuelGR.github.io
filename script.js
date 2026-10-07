/* ==========================================================================
   PORTAFOLIO INTERACTIVO - LUIS MANUEL GARCÍA RIVERO
   JavaScript Engine (Interactivity, Theme Switcher, Modals, Filters, Toast)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------------------
  // 1. Dark / Light Theme Controller
  // ----------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlDoc = document.documentElement;

  // Read saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlDoc.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlDoc.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.title = 'Cambiar a Modo Claro';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.title = 'Cambiar a Modo Oscuro';
    }
  }

  // ----------------------------------------------------
  // 2. Mobile Menu Navigation Toggle
  // ----------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

  if (mobileToggle && navMenu) {
    function setMobileMenuOpen(isOpen) {
      navMenu.classList.toggle('active', isOpen);
      if (mobileMenuBackdrop) mobileMenuBackdrop.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }

    mobileToggle.addEventListener('click', () => {
      setMobileMenuOpen(!navMenu.classList.contains('active'));
    });

    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.addEventListener('click', () => setMobileMenuOpen(false));
    }

    // Close mobile menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => setMobileMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('active')) {
        setMobileMenuOpen(false);
        mobileToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        setMobileMenuOpen(false);
      }
    });
  }

  // ----------------------------------------------------
  // 3. Stats Counter Animation (Count-up)
  // ----------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target') || '0', 10);
      const hasPercent = stat.innerText.includes('%');
      let count = 0;
      const duration = 1500;
      const stepTime = Math.abs(Math.floor(duration / (target || 1)));

      const timer = setInterval(() => {
        count += 1;
        stat.innerText = count + (hasPercent ? '%' : '+');
        if (count >= target) {
          stat.innerText = target + (hasPercent ? '%' : (target === 1 ? '' : '+'));
          clearInterval(timer);
        }
      }, Math.max(stepTime, 20));
    });
  }

  // Trigger counter when hero section comes into view
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(heroSection);
  }

  // ----------------------------------------------------
  // 4. Timeline Tab Switcher (Work vs Vida UNITEC)
  // ----------------------------------------------------
  const tabBtns = document.querySelectorAll('.timeline-controls .tab-btn');
  const workContent = document.getElementById('timeline-work-content');
  const unitecContent = document.getElementById('timeline-unitec-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-target');
      if (target === 'work') {
        workContent.style.display = 'block';
        unitecContent.style.display = 'none';
      } else {
        workContent.style.display = 'none';
        unitecContent.style.display = 'block';
      }
    });
  });

  // Helper for fast, smooth card filter transitions without grid layout jumps
  function animateCardFilter(cards, attrName, filterValue) {
    cards.forEach(card => {
      // Clear staggered scroll-reveal delay so all cards filter synchronously
      card.style.transitionDelay = '0s';

      const val = card.getAttribute(attrName);
      const isMatch = filterValue === 'all' || val === filterValue;

      if (isMatch) {
        card.classList.remove('filter-hidden');
        card.classList.remove('filter-visible');
        void card.offsetWidth; // Trigger DOM reflow to restart CSS keyframe
        card.classList.add('filter-visible');
      } else {
        card.classList.remove('filter-visible');
        card.classList.add('filter-hidden');
      }
    });
  }

  // ----------------------------------------------------
  // 5. Skills & Tools Category Filter
  // ----------------------------------------------------
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const toolCards = document.querySelectorAll('.tools-grid .tool-card');

  filterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.getAttribute('data-filter');
      animateCardFilter(toolCards, 'data-category', filter);
    });
  });

  // ----------------------------------------------------
  // 5b. Courses Institution Filter
  // ----------------------------------------------------
  const courseFilterBtns = document.querySelectorAll('.courses-filter .filter-btn');
  const courseCards = document.querySelectorAll('.courses-grid .course-card');

  courseFilterBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.classList.contains('active')));
    btn.addEventListener('click', () => {
      courseFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.getAttribute('data-filter');
      animateCardFilter(courseCards, 'data-institution', filter);
    });
  });

  // ----------------------------------------------------
  // 6. SISPRO Modal System
  // ----------------------------------------------------
  const sisproModal = document.getElementById('sispro-modal');
  const openSisproBtn = document.getElementById('open-sispro-btn');
  const openSisproModalBtn = document.getElementById('open-sispro-modal-btn');
  const closeSisproBtn = document.getElementById('close-sispro-modal');

  function openModal() {
    if (sisproModal) sisproModal.classList.add('active');
  }

  function closeModal() {
    if (sisproModal) sisproModal.classList.remove('active');
  }

  if (openSisproBtn) openSisproBtn.addEventListener('click', openModal);
  if (openSisproModalBtn) openSisproModalBtn.addEventListener('click', openModal);
  if (closeSisproBtn) closeSisproBtn.addEventListener('click', closeModal);

  if (sisproModal) {
    sisproModal.addEventListener('click', (e) => {
      if (e.target === sisproModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sisproModal && sisproModal.classList.contains('active')) {
      closeModal();
    }
  });

  // ----------------------------------------------------
  // 6b. Certificate Viewer Modal System
  // ----------------------------------------------------
  const certModal = document.getElementById('cert-modal');
  const certIframe = document.getElementById('cert-iframe');
  const certViewer = document.querySelector('.cert-viewer');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certOpenLink = document.getElementById('cert-open-link');
  const certDownloadLink = document.getElementById('cert-download-link');
  const closeCertBtn = document.getElementById('close-cert-modal');
  const closeCertBtnFooter = document.getElementById('close-cert-modal-btn');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');
  let activeCertAspectRatio = 1.415;

  function fitCertificateViewer() {
    if (!certViewer || !certViewer.parentElement) return;
    const modalStyles = window.getComputedStyle(certViewer.parentElement);
    const horizontalPadding = parseFloat(modalStyles.paddingLeft) + parseFloat(modalStyles.paddingRight);
    const availableWidth = certViewer.parentElement.clientWidth - horizontalPadding;
    const availableHeight = window.innerHeight * 0.6;
    certViewer.style.width = `${Math.min(availableWidth, availableHeight * activeCertAspectRatio)}px`;
  }

  function openCertModal(pdfUrl, title, aspectRatio) {
    if (!certModal) return;
    const parsedAspectRatio = Number(aspectRatio);
    activeCertAspectRatio = Number.isFinite(parsedAspectRatio) && parsedAspectRatio > 0
      ? parsedAspectRatio
      : 1.415;
    if (certViewer) certViewer.style.aspectRatio = String(activeCertAspectRatio);
    if (certIframe) certIframe.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    if (certModalTitle) certModalTitle.innerText = title || 'Certificado Académico';
    if (certOpenLink) certOpenLink.href = pdfUrl;
    if (certDownloadLink) certDownloadLink.href = pdfUrl;
    certModal.classList.add('active');
    fitCertificateViewer();
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    if (certIframe) certIframe.src = '';
    if (certViewer) {
      certViewer.style.removeProperty('aspect-ratio');
      certViewer.style.removeProperty('width');
    }
    if (certOpenLink) certOpenLink.href = '#';
    if (certDownloadLink) certDownloadLink.href = '#';
  }

  viewCertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certUrl = btn.getAttribute('data-cert');
      const title = btn.getAttribute('data-title');
      openCertModal(certUrl, title, btn.getAttribute('data-aspect-ratio'));
    });
  });

  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertModal);
  if (closeCertBtnFooter) closeCertBtnFooter.addEventListener('click', closeCertModal);
  window.addEventListener('resize', () => {
    if (certModal && certModal.classList.contains('active')) fitCertificateViewer();
  });

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  // ----------------------------------------------------
  // 7. Toast Notification Utility
  // ----------------------------------------------------
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.innerText = message;
    toast.classList.add('active');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // ----------------------------------------------------
  // 8. Copy to Clipboard Handlers (Email & Phone)
  // ----------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyPhoneBtn = document.getElementById('copy-phone-btn');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('LUISMANUEL1402@GMAIL.COM').then(() => {
        showToast('¡Correo LUISMANUEL1402@GMAIL.COM copiado al portapapeles!');
      });
    });
  }

  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+584244598847').then(() => {
        showToast('¡Teléfono (+58) 424-4598847 copiado al portapapeles!');
      });
    });
  }

  // ----------------------------------------------------
  // 9. Contact Form Native Direct Dispatch (FormSubmit)
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando Correo...';
      }
    });
  }

  // ----------------------------------------------------
  // 10. PDF CV Download Notification Handler
  // ----------------------------------------------------
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      showToast('¡Descargando CV Completo (PDF)...!');
    });
  }

  // ----------------------------------------------------
  // 11. Smooth Scroll Reveal Engine (IntersectionObserver)
  //     Works on Android, iOS, Tablet and PC
  // ----------------------------------------------------

  // Mark all revealable elements
  const revealTargets = document.querySelectorAll(
    'section, .glass-card, .course-card, .tool-card, .timeline-card, .floating-badge, .hero-stats, .stat-card, .contact-card-item, .degree-card'
  );

  // Staggered delay per card inside grids
  const staggerParents = document.querySelectorAll('.tools-grid, .courses-grid, .hero-stats, .about-grid, .contact-grid');
  staggerParents.forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  revealTargets.forEach(el => {
    el.classList.add('reveal-on-scroll');
  });

  // Check if user prefers reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    // Skip animations entirely
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Reset staggered transition-delay after initial entrance so filtering is instant
          setTimeout(() => {
            entry.target.style.transitionDelay = '0s';
          }, 600);
          // Unobserve once visible to free resources on mobile
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // ----------------------------------------------------
  // 12. Active Nav Link Scroll Spy (passive + debounced)
  // ----------------------------------------------------
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  let scrollTicking = false;

  function updateBackToTopVisibility() {
    if (!backToTopBtn) return;
    const isPastIntro = window.scrollY > 320;
    backToTopBtn.classList.toggle('is-visible', isPastIntro);
    backToTopBtn.setAttribute('aria-hidden', String(!isPastIntro));
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  updateBackToTopVisibility();

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateBackToTopVisibility();

        let current = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 160;
          if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

});
